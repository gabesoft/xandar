'use strict';

const INPUT_CLASS = 'input-field';
const UNMATCHED_VALUE = '6D622E76-EFEF-4798-965D-3AA6419B37E5';
const ITEM_TYPES = { tag: 'tag', feed: 'feed', status: 'status' };

const React = require('react');
const ReactDOM = require('react-dom');
const ReactServer = require('react-dom/server');
const actions = require('../flux/search-actions');
const postActions = require('../flux/post-actions');
const dispatcher = require('../flux/dispatcher');
const Awesomplete = require('awesomplete');
const Loader = require('./loader.jsx');
const Item = require('./nav-post-search-item.jsx');
const itemFactory = React.createFactory(Item);
const searchStore = require('../flux/search-store');
const tagStore = require('../flux/tag-store');
const toast = require('../toast').toast;
const ct = require('../constants');
const query = require('../post-query');

module.exports = class NavSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: tagStore.getTags(),
      feeds: searchStore.getFeeds(),
      className: INPUT_CLASS
    };
    this.onClear = this.onClear.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onTagsDataChange = this.onTagsDataChange.bind(this);
    this.onFeedDataChange = this.onFeedDataChange.bind(this);
    this.initAwesomplete = this.initAwesomplete.bind(this);
    this.awesomplete = null;
    this.awesompleteInitialized = false;
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(event) {
    event.preventDefault();
    this.updateQuery();
  }

  updateQuery() {
    try {
      const queryObj = query.parse((this.state.value || '').trim());
      actions.updateQuerySearch({ query: queryObj });

      if ((this.state.value || '').length > 0) {
        actions.savePostQuery({ query: queryObj });
      }

      this.setState({ loading: true });
      postActions.loadPosts(queryObj);
    } catch (e) {
      toast.error('Failed to parse query');
      toast.error(e.message);
    }
  }

  onClear() {
    this.setState({ value: null }, () => this.updateQuery());
    actions.clearQuerySearch();
  }

  onChange(event) {
    this.setState({ value: event.target.value });
  }

  onFocus() {
    this.setState({ className: `${INPUT_CLASS} active` });
  }

  onBlur() {
    this.setState({ className: INPUT_CLASS });
    if (!this.state.value) {
      this.updateQuery();
    }
  }

  onTagsDataChange() {
    this.setState({ tags: tagStore.getTags() }, () => {
      if (this.awesomplete) {
        this.awesomplete.list = this.getCompletionList();
      }
    });
  }

  onFeedDataChange(data) {
    if (data.type === 'feeds') {
      this.setState({ feeds: searchStore.getFeeds() }, () => {
        if (this.awesomplete) {
          this.awesomplete.list = this.getCompletionList();
        }
      });
    }
  }

  getCompletionList() {
    const feeds = this.state.feeds
      .filter(feed => Boolean(feed.title))
      .map(feed => ({ type: 'feed', value: feed.titleId, name: feed.title }));
    const tags = this.state.tags.map(tag => ({ type: 'tag', value: tag }));
    const status = ['read', 'unread'].map(st => ({ type: 'status', value: st }));

    return feeds.concat(tags).concat(status);
  }

  componentDidMount() {
    actions.loadFeeds();
    tagStore.addListener(ct.tags.STORE_CHANGE, this.onTagsDataChange);
    searchStore.addListener(ct.search.STORE_CHANGE, this.onFeedDataChange);
    searchStore.addListener('error', toast.error);
    this.tokenId = dispatcher.register(action => {
      switch (action.type) {
        case ct.posts.LOAD_POSTS_FAIL:
        case ct.posts.LOAD_POSTS_DONE:
          this.setState({ loading: false });
          break;
        case ct.search.SELECT_POST_QUERY:
          this.setState({ value: action.data.text, loading: true });
          break;
        default:
          break;
      }
    });
  }

  componentWillUnmount() {
    tagStore.removeListener(ct.tags.STORE_CHANGE, this.onTagsDataChange);
    searchStore.removeListener(ct.search.STORE_CHANGE, this.onFeedDataChange);
    searchStore.removeListener('error', toast.error);
    dispatcher.unregister(this.tokenId);
  }

  parseAwesompleteItem(text) {
    const tag = text.match(/(^[^ ]+)TAG.*$/);
    const status = text.match(/(^[^ ]+)STATUS.*$/);
    const feed = text.match(/(^[^ ]+)FEED.*$/);

    if (tag) {
      return { type: ITEM_TYPES.tag, value: tag[1], pre: '#' };
    } else if (feed) {
      return { type: ITEM_TYPES.feed, value: feed[1], pre: '@' };
    } else if (status) {
      return { type: ITEM_TYPES.status, value: status[1], pre: ':' };
    }
  }

  makeAwesompleteItem(data, search) {
    const $ = Awesomplete.$;
    const match = search.match(/(?:#|@|:)?([^ ()]+)$/);
    const entry = match ? match[1] : UNMATCHED_VALUE;
    const value = RegExp($.regExpEscape(entry), 'gi');

    let title = '';
    let id = '';
    let name = '';

    switch (data.type) {
      case ITEM_TYPES.feed:
        id = data.value;
        name = data.name;
        title = ITEM_TYPES.feed;
        break;
      case ITEM_TYPES.tag:
        id = data.value;
        title = ITEM_TYPES.tag;
        break;
      case ITEM_TYPES.status:
        id = data.value;
        title = ITEM_TYPES.status;
        break;
      default:
        break;
    }

    id = id.replace(value, '<mark>$&</mark>');
    title = title.toUpperCase();

    const item = itemFactory({ title, id, name });
    const html = ReactServer.renderToString(item);

    return $.create('div', { innerHTML: html }).firstChild;
  }

  initAwesomplete(el) {
    if (el !== null && !this.awesompleteInitialized) {
      const input = ReactDOM.findDOMNode(el);
      const awesomplete = new Awesomplete(input);
      const contains = Awesomplete.FILTER_CONTAINS;

      awesomplete.list = this.getCompletionList();
      awesomplete.autoFirst = true;
      awesomplete.item = this.makeAwesompleteItem;

      awesomplete.filter = (data, inputStr) => {
        const text = data.value;
        const match = inputStr.match(/(?:#|@|:)?([^ ()]+)$/);
        const res = contains(text, match ? match[1] : UNMATCHED_VALUE);
        return res;
      };

      awesomplete.replace = text => {
        const before = input.value.match(/^.*[ ()]+|/)[0];
        const item = this.parseAwesompleteItem(text);

        input.value = before + `${item.pre}${item.value}`;

        this.setState({ value: input.value }, () => this.updateQuery());
      };

      this.awesompleteInitialized = true;
      this.awesomplete = awesomplete;
    }
  }

  render() {
    const loader = (<Loader size="medium" className="nav-search-loader"/>);
    const searchIcon = (<i className="material-icons search">search</i>);

    return (
      <form onSubmit={this.onSubmit} className="search-form nav-search">
        <div className={this.state.className}>
          <input
            id="search"
            type="search"
            ref={this.initAwesomplete}
            value={this.state.value}
            onChange={this.onChange}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            required
          />
          <label htmlFor="search">
            {this.state.loading ? loader : searchIcon}
          </label>
          <i onClick={this.onClear} className="material-icons close">
            close
          </i>
        </div>
      </form>
    );
  }
};
