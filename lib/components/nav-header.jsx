'use strict';

const unmatchedValue = '6D622E76-EFEF-4798-965D-3AA6419B37E5';
const itemTypes = { tag: 'tag', feed: 'feed', status: 'status' };

const React = require('react');
const ReactDOM = require('react-dom');
const ReactServer = require('react-dom/server');
const Icon = require('./icon.jsx');
const Item = require('./nav-post-search-item.jsx');
const itemFactory = React.createFactory(Item);
const Awesomplete = require('awesomplete');
const constants = require('../constants');
const query = require('../post-query');
const searchStore = require('../flux/search-store');
const tagStore = require('../flux/tag-store');
const actions = require('../flux/search-actions');
const postActions = require('../flux/post-actions');
const dispatcher = require('../flux/dispatcher');
const cls = require('../util').cls;

module.exports = class NavHeader extends React.Component {
  constructor(props) {
    super(props);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.initAwesomplete = this.initAwesomplete.bind(this);
    this.onTagsDataChange = this.onTagsDataChange.bind(this);
    this.onFeedDataChange = this.onFeedDataChange.bind(this);
    this.onSearchFocus = this.onSearchFocus.bind(this);
    this.onSearchBlur = this.onSearchBlur.bind(this);
    this.updateQuery = this.updateQuery.bind(this);
    this.awesomplete = null;
    this.awesompleteInitialized = false;
    this.state = {
      tags: tagStore.getTags(),
      feeds: searchStore.getFeeds()
    };
  }

  componentDidMount() {
    actions.loadFeeds();
    tagStore.addListener(constants.tags.STORE_CHANGE, this.onTagsDataChange);
    searchStore.addListener(constants.search.STORE_CHANGE, this.onFeedDataChange);
    this.tokenId = dispatcher.register(action => {
      switch (action.type) {
        case constants.search.SELECT_POST_QUERY:
          this.setState({
            searchValue: action.data.userText || action.data.text || action.data.toString(),
            queryTitle: action.data.title
          });
          break;
        case constants.search.SAVE_POST_QUERY_DONE:
          const text = action.data.text || action.data.toString();
          if (text === this.state.searchValue) {
            this.setState({ queryTitle: action.data.title });
          }
          break;
        case constants.feeds.SUBSCRIBE_DONE:
          actions.loadFeeds();
          break;
        case constants.feeds.UNSUBSCRIBE_DONE:
          actions.loadFeeds();
          break;
        default:
          break;
      }
    });
  }

  componentWillUnmount() {
    tagStore.removeListener(constants.tags.STORE_CHANGE, this.onTagsDataChange);
    searchStore.removeListener(constants.search.STORE_CHANGE, this.onFeedDataChange);
    dispatcher.unregister(this.tokenId);
  }

  onSearchFocus() {
    this.setState({ searchFocused: true });
  }

  onSearchBlur() {
    this.setState({ searchFocused: false });
  }

  onSearchChange(event) {
    this.setState({ searchValue: event.target.value }, this.updateQuery);
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

  updateQuery() {
    try {
      this.setState({ queryError: false, queryTitle: null });

      const value = (this.state.searchValue || '').trim();
      const queryObj = query.parse(value);
      queryObj.lastUsed = new Date();

      actions.updateQuerySearch({ query: queryObj });

      if ((this.state.searchValue || '').length > 0) {
        actions.savePostQuery({ query: queryObj });
      }

      postActions.loadPosts(queryObj);
    } catch (e) {
      this.setState({ queryError: true });
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

  parseAwesompleteItem(text) {
    const tag = text.match(/(^[^ ]+)TAG.*$/);
    const status = text.match(/(^[^ ]+)STATUS.*$/);
    const feed = text.match(/(^[^ ]+)FEED.*$/);

    if (tag) {
      return { type: itemTypes.tag, value: tag[1], pre: '#' };
    } else if (feed) {
      return { type: itemTypes.feed, value: feed[1], pre: '@' };
    } else if (status) {
      return { type: itemTypes.status, value: status[1], pre: ':' };
    }
  }

  makeAwesompleteItem(data, search) {
    const $ = Awesomplete.$;
    const match = search.match(/!?(?:#|@|:)?([^ ()]+)$/);
    const entry = match ? match[1] : unmatchedValue;
    const value = RegExp($.regExpEscape(entry), 'i');

    let title = '';
    let id = '';
    let name = '';

    switch (data.type) {
      case itemTypes.feed:
        id = data.value;
        name = data.name;
        title = itemTypes.feed;
        break;
      case itemTypes.tag:
        id = data.value;
        title = itemTypes.tag;
        break;
      case itemTypes.status:
        id = data.value;
        title = itemTypes.status;
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
        const match = inputStr.match(/!?(?:#|@|:)?([^ ()]+)$/);
        const res = contains(text, match ? match[1] : unmatchedValue);
        return res;
      };

      awesomplete.replace = text => {
        const before = input.value.match(/^.*[ ()]+|/)[0];
        const current = input.value.substring(before.length);
        const item = this.parseAwesompleteItem(text);
        const not = current.startsWith('!');

        input.value = before + `${not ? '!' : ''}${item.pre}${item.value}`;

        this.setState({ searchValue: input.value }, this.updateQuery);
      };

      input.addEventListener('awesomplete-selectcomplete', () => {
        this.setState({ searchValue: input.value });
        input.focus();
      });

      this.awesompleteInitialized = true;
      this.awesomplete = awesomplete;
    }
  }

  render() {
    const user = this.props.user.meta;
    const info = `${user.email} via github, click to logout`;
    const searchFocused = this.state.searchFocused;
    const hasTitle = this.state.queryTitle;
    const showTitle = hasTitle && !searchFocused;
    const headerClass = cls('header-text', showTitle ? 'title' : null);
    const className = cls(
      'nav-header',
      this.props.className,
      this.state.queryError ? 'query-error' : null
    );

    return (
      <div className={className}>
        <div className="nav-left">
          <div className="search-bar">
            <input
              className="search-input"
              type="search"
              onChange={this.onSearchChange}
              onFocus={this.onSearchFocus}
              onBlur={this.onSearchBlur}
              value={this.state.searchValue}
              ref={this.initAwesomplete}
            />
            <Icon name="magnify" className="search-icon"/>
          </div>
        </div>

        <div className="nav-center">
          <div className={headerClass}>
            <span>
              {showTitle ? this.state.queryTitle : this.state.searchValue}
            </span>
          </div>
        </div>

        <div className="nav-right">
          <div className="user">
            <img className="user-avatar" alt="" src={user.avatar_url}/>
            <div className="user-info">
              <a href="/logout" title={info}>
                {user.login}
              </a>
            </div>
          </div>
          <Icon name="account-outline" className="user-icon" size="medium"/>
        </div>
      </div>
    );
  }
};
