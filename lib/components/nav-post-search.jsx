'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const actions = require('../flux/search-actions');
const Awesomplete = require('awesomplete');
const searchStore = require('../flux/search-store');
const tagStore = require('../flux/tag-store');
const ct = require('../constants');

module.exports = class NavSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: '', tags: tagStore.getTags(), feeds: searchStore.getFeeds() };
    this.onClear = this.onClear.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onTagsDataChange = this.onTagsDataChange.bind(this);
    this.onFeedDataChange = this.onFeedDataChange.bind(this);
    this.initAwesomplete = this.initAwesomplete.bind(this);
    this.awesomplete = null;
    this.awesompleteInitialized = false;
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(event) {
    event.preventDefault();
    console.log('submit', this.state);
  }

  onClear() {
    this.setState({ value: '' });
  }

  onChange(event) {
    const text = event.target.value;
    this.setState({ value: text });
  }

  onTagsDataChange() {
    this.setState({ tags: tagStore.getTags() });
    if (this.awesomplete) {
      this.awesomplete.list = this.getCompletionList();
    }
  }

  onFeedDataChange() {
    this.setState({ feeds: searchStore.getFeeds() });
    if (this.awesomplete) {
      this.awesomplete.list = this.getCompletionList();
    }
  }

  getCompletionList() {
    const feeds = this.state.feeds
      .filter(feed => Boolean(feed.title))
      .map(feed => `@${feed.titleId} : ${feed.title}`);
    const tags = this.state.tags.map(tag => `#${tag}`);
    const flags = ['read', 'unread'].map(flag => `:${flag}`);
    return feeds.concat(tags).concat(flags);
  }

  componentDidMount() {
    actions.loadFeeds();
    tagStore.addListener(ct.tags.STORE_CHANGE, this.onTagsDataChange);
    searchStore.addListener(ct.search.STORE_FEEDS_CHANGE, this.onFeedDataChange);
  }

  componentWillUnmount() {
    tagStore.removeListener(ct.tags.STORE_CHANGE, this.onTagsDataChange);
    searchStore.removeListener(ct.search.STORE_FEEDS_CHANGE, this.onFeedDataChange);
  }

  initAwesomplete(el) {
    if (el !== null && !this.awesompleteInitialized) {
      const input = ReactDOM.findDOMNode(el);
      const awesomplete = new Awesomplete(input);
      const contains = Awesomplete.FILTER_CONTAINS;
      const $ = Awesomplete.$;
      const noMatch = '6D622E76-EFEF-4798-965D-3AA6419B37E5';
      awesomplete.list = this.getCompletionList();
      awesomplete.autoFirst = true;

      awesomplete.item = (text, search) => {
        const match = search.match(/[^ ()]+$/);
        const entry = match ? match[0] : noMatch;
        const value = RegExp($.regExpEscape(entry), 'gi');

        let title = '';
        let id = '';
        let name = '';

        if (text.startsWith('@')) {
          const parts = text.split(/:/);
          id = parts[0].replace(value, '<mark>$&</mark>');
          name = parts[1];
          title = 'feed';
        } else if (text.startsWith('#')) {
          id = text.replace(value, '<mark>$&</mark>');
          title = 'tag';
        } else if (text.startsWith(':')) {
          id = text.replace(value, '<mark>$&</mark>');
          title = 'status';
        }

        const titleHtml = `<span class="title">${title}</span>`;
        const idHtml = `<span class="id">${id}</span>`;
        const nameHtml = `<span class="name">${name}</span>`;

        return $.create('li', {
          innerHTML: `${titleHtml}${idHtml}${nameHtml}`,
          'aria-selected': false
        });
      };

      awesomplete.filter = (text, inputStr) => {
        const match = inputStr.match(/[^ ()]+$/);
        const res = contains(text, match ? match[0] : noMatch);
        return res;
      };

      awesomplete.replace = text => {
        text = text.replace(/^feed/, '').replace(/^tag/, '').replace(/^status/, '');
        const before = input.value.match(/^.*[ ()]+|/)[0];
        input.value = before + (text.replace(/\s+.*$/g, ''));
        this.setState({ value: input.value });
      };

      input.addEventListener('awesomplete-select', event => {
        console.log('select', event.text);
      });

      this.awesompleteInitialized = true;
      this.awesomplete = awesomplete;
    }
  }

  render() {
    return (
      <form onSubmit={this.onSubmit} className="search-form nav-search">
        <div className="input-field">
          <input
            id="search"
            type="search"
            ref={this.initAwesomplete}
            value={this.state.value}
            onChange={this.onChange}
            required
          />
          <label htmlFor="search">
            <i className="material-icons">search</i>
          </label>
          <i onClick={this.onClear} className="material-icons">
            close
          </i>
        </div>
      </form>
    );
  }
};
