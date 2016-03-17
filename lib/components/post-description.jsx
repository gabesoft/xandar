'use strict';

const classes = {
  button: 'lang-button',
  input: 'lang-input',
  langEdit: 'lang-edit-mode',
  description: 'post-description'
};

const makeSelectors = require('../util').makeSelectors;
const selectors = makeSelectors(classes);

const React = require('react');
const ReactDOM = require('react-dom');
const ReactServer = require('react-dom/server');
const escape = require('../util').regexpEscape;
const cls = require('../util').cls;
const Awesomplete = require('awesomplete');
const Loader = require('./loader.jsx');
const langs = require('../data/lang');
const feeds = require('../data/iframe-feeds');
const actions = require('../flux/post-actions');
const hljs = require('highlight.js');
const Item = require('./highlight-item.jsx');
const itemFactory = React.createFactory(Item);
const LangButton = require('./lang-button.jsx');
const buttonFactory = React.createFactory(LangButton);
const LangInput = require('./lang-input.jsx');
const inputFactory = React.createFactory(LangInput);
const marked = require('marked');
const $ = window.$;
const $$ = window.$$;

const langMap = langs.reduce((acc, ln) => {
  acc[ln[1]] = true;
  return acc;
}, {});

module.exports = class PostDescription extends React.Component {
  constructor(props) {
    super(props);

    this.readCodeBlocks();
    this.state = { loading: true };
    this.onIframeLoaded = this.onIframeLoaded.bind(this);
  }

  onIframeLoaded() {
    this.setState({ loading: false });
  }

  readCodeBlocks() {
    const blocks = this.props.post._source.codeBlocks || [];
    this.blocks = blocks.map(block => ({
      userEdited: block.userEdited,
      lang: block.lang
    }));
  }

  saveCodeBlocks() {
    const post = this.props.post;
    post._source.codeBlocks = this.blocks
      .map(block => ({
        lang: block.userEdited ? block.lang : null,
        userEdited: block.userEdited
      })
      );
    actions.savePost(post);
  }

  getClassName(isIframe) {
    return cls(
      classes.description,
      this.props.className,
      isIframe ? 'iframe' : null
    );
  }

  renderLoader() {
    return (<Loader size="big" className="post-content-loader" />);
  }

  getPostContent() {
    const post = this.props.post._source.post;
    const data = post.description;
    const tags = this.props.post._source.tags || [];
    const markdown = tags.find(tag => tag === 'markdown-format');
    return markdown ? marked(data) : data;
  }

  renderDefault() {
    return (
      <div className={this.getClassName()}>
        <ul
          className="post-description-content"
          ref="content"
          dangerouslySetInnerHTML={{ __html: this.getPostContent() }}>
        </ul>
      </div>
    );
  }

  renderIframe(src) {
    const post = this.props.post._source.post;
    const html = { __html: post.description };

    return (
      <div className={this.getClassName(true)}>
        {this.state.loading ? this.renderLoader() : null}
        <iframe
          src={src}
          onLoad={this.onIframeLoaded}
          allowFullScreen
        />
        <div>
          <div dangerouslySetInnerHTML={html}></div>
        </div>
      </div>
    );
  }

  processYoutubeLink(link) {
    const match = link.match(/https?:\/\/www.youtube.com\/watch\?v=(.+)$/);
    return match ? `https://youtube.com/embed/${match[1]}` : null;
  }

  processYoutube() {
    const post = this.props.post._source.post;
    const link = post.link || '';
    const src = this.processYoutubeLink(link);
    return src ? this.renderIframe(src) : null;
  }

  processMissingContent(pattern) {
    const post = this.props.post._source.post;
    const link = post.link || '';
    const regex = new RegExp(escape(pattern), 'i');
    const match = link.match(regex);
    return match ? this.renderIframe(link) : null;
  }

  processHackerNews() {
    const post = this.props.post._source.post;
    const link = post.link || '';
    const regex = new RegExp('news.ycombinator.com');
    const match = (post.comments || '').match(regex);
    return match ? this.renderIframe(link) : null;
  }

  processReddit() {
    const post = this.props.post._source.post;
    const link = post.link || '';
    const regex = new RegExp('<a href="([^"]+)">\\[link\\]<\/a>', 'i');
    const match = (post.description || '').match(regex);

    if (match && match[1] && link.match(/reddit.com/)) {
      return this.renderIframe(this.processYoutubeLink(match[1]) || match[1]);
    }
  }

  initAwesomplete(input) {
    const awesomplete = new Awesomplete(input);
    const util = Awesomplete.$;
    const contains = Awesomplete.FILTER_CONTAINS;

    awesomplete.list = langs.map(ln => `${ln[1]}:${ln[0]}`);
    awesomplete.autoFirst = true;
    awesomplete.minChars = 1;
    awesomplete.item = (text, search) => {
      const value = RegExp(util.regExpEscape(search.trim()), 'gi');
      const textParts = text.split(/:/);
      const html = ReactServer.renderToString(itemFactory({
        value: textParts[0].replace(value, '<mark>$&</mark>'),
        name: textParts[1],
        separator: ':'
      }));

      return util.create('div', { innerHTML: html }).firstChild;
    };

    awesomplete.filter = (text, inputStr) => {
      const value = text.split(/:/)[0];
      return contains(value, inputStr);
    };

    awesomplete.replace = text => {
      input.value = text.split(/:/)[0];
      return input.value;
    };

    return awesomplete;
  }

  getLangFromTags() {
    const tags = this.props.post._source.tags || [];
    const pattern = /^([^-]+)-lang/;
    const lang = tags.find(tag => {
      const match = tag.match(pattern);
      return match && langMap[match[1]];
    });
    return lang ? lang.replace(/-lang$/, '') : null;
  }

  highlightBlock(index) {
    const block = this.blocks[index];
    const lang = block.lang || this.getLangFromTags();
    const text = block.text;

    block.el.removeAttribute('style');

    if (lang === 'none') {
      block.el.innerHTML = block.html;
    } else {
      const hl = lang ? hljs.highlight(lang, text, true) : hljs.highlightAuto(text);

      block.lang = hl.language;

      block.el.innerHTML = hl.value;
      block.el.classList.remove();
      block.el.classList.add('hljs', block.lang);
    }
  }

  addEditButton(index) {
    const block = this.blocks[index];
    const button = buttonFactory({ lang: block.lang, className: classes.button });

    block.el.insertAdjacentHTML('afterbegin', ReactServer.renderToString(button));

    const buttonEl = $(selectors.button, block.el);
    buttonEl.addEventListener('click', event => {
      this.addEditInput(index, event);
      $.unbind(buttonEl);
    });
  }

  addEditInput(index) {
    const block = this.blocks[index];
    const input = inputFactory({ className: classes.input });

    this.removeElements(selectors.button, block.el);

    block.el.insertAdjacentHTML('afterbegin', ReactServer.renderToString(input));
    block.el.parentElement.classList.add(classes.langEdit);

    const inputEl = $(selectors.input, block.el);
    const awesomplete = this.initAwesomplete(inputEl);
    const reset = () => {
      $.unbind(inputEl);
      inputEl.remove();
      block.el.parentElement.classList.remove(classes.langEdit);
      this.initializeBlock(index);
    };

    inputEl.focus();
    inputEl.addEventListener('awesomplete-select', event => {
      block.lang = awesomplete.replace(event.text);
      block.userEdited = true;
      reset();
      this.saveCodeBlocks();
    });

    inputEl.addEventListener('blur', reset);
    inputEl.addEventListener('keydown', event => {
      if (event.which === 27) {
        reset();
      }
    });
  }

  initializeBlock(index) {
    this.highlightBlock(index);
    this.addEditButton(index);
  }

  initializeCodeBlocks() {
    if (this.refs.content) {
      const el = ReactDOM.findDOMNode(this.refs.content);

      $$('pre code', el).forEach((codeEl, i) => {
        const block = this.blocks[i] || {};

        this.removeElements(selectors.button, codeEl);
        this.removeElements(selectors.input, codeEl);

        block.el = codeEl;
        block.text = codeEl.textContent;
        block.html = codeEl.innerHTML;

        this.blocks[i] = block;
      });

      this.blocks.forEach((_, index) => this.initializeBlock(index));
    }
  }

  clearEventHandlers() {
    const parent = ReactDOM.findDOMNode(this.refs.content);
    if (parent) {
      $$(selectors.button, parent).forEach($.unbind.bind($));
      $$(selectors.input);
    }
  }

  removeElements(selector, parent, removeParent) {
    $$(selector, parent).forEach(el => {
      return removeParent ? el.parentElement.remove() : el.remove();
    });
  }

  removeSharing() {
    const parent = ReactDOM.findDOMNode(this.refs.content);
    const remove = (selector, removeParent) => {
      this.removeElements(selector, parent, removeParent);
    };

    if (parent) {
      remove('a[title="Like on Facebook"]', true);
      remove('a[href="http://dwf.tw/fluent2016"]');
      remove('[href*="rss.buysellads.com"]');
      remove('[href*="auslieferung"]');
      remove('img[src*="statisches.auslieferung"]');
      remove('img[src*="featured_advert.jpg"]');
      remove('img[src="http://www.virtumundo.com/images/spacer.gif"]');
      remove('.a2a_kit');
    }
  }

  componentDidMount() {
    this.initializeCodeBlocks();
    this.removeSharing();
  }

  componentWillUpdate() {
    this.clearEventHandlers();
  }

  componentWillReceiveProps(props) {
    this.setState({ loading: this.props.post._id !== props.post._id });
  }

  componentDidUpdate() {
    this.readCodeBlocks();
    this.initializeCodeBlocks();
    this.removeSharing();
  }

  componentWillUnmount() {
    this.clearEventHandlers();
  }

  render() {
    const processors = feeds.map(feed => () => this.processMissingContent(feed));

    processors.push(() => this.processHackerNews());
    processors.push(() => this.processReddit());
    processors.push(() => this.processYoutube());
    processors.push(() => this.renderDefault());

    return (processors.find(process => process())());
  }
};
