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
const $ = require('jquery');
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
const langMap = langs.reduce((acc, ln) => {
  acc[ln[1]] = true;
  return acc;
}, {});

module.exports = class PostDescription extends React.Component {
  constructor(props) {
    super(props);

    this.blocks = this.props.post._source.codeBlocks || [];
    this.state = { loading: true };
    this.onIframeLoaded = this.onIframeLoaded.bind(this);
  }

  onIframeLoaded() {
    this.setState({ loading: false });
  }

  savePostBlocks() {
    const post = this.props.post;
    post._source.codeBlocks = this.blocks
      .map(block => {
        return {
          lang: block.userEdited ? block.lang : null,
          userEdited: block.userEdited,
          index: block.index
        };
      });
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
    return (<Loader size="big" className="post-content-loader"/>);
  }

  renderDefault() {
    const post = this.props.post._source.post;
    const data = post.description;
    const html = { __html: data };
    return (
      <div className={this.getClassName()}>
        <ul
          className="post-description-content"
          ref={el => this.dataEl = el}
          dangerouslySetInnerHTML={html}>
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
    const $$ = Awesomplete.$;
    const contains = Awesomplete.FILTER_CONTAINS;

    awesomplete.list = langs.map(ln => `${ln[1]}:${ln[0]}`);
    awesomplete.autoFirst = true;
    awesomplete.minChars = 1;
    awesomplete.item = (text, search) => {
      const value = RegExp($$.regExpEscape(search.trim()), 'gi');
      const textParts = text.split(/:/);
      const html = ReactServer.renderToString(itemFactory({
        value: textParts[0].replace(value, '<mark>$&</mark>'),
        name: textParts[1],
        separator: ':'
      }));

      return $$.create('div', { innerHTML: html }).firstChild;
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
    const $block = $(block.el);
    const lang = block.lang || this.getLangFromTags();
    const text = block.text;

    $block.removeAttr('style');

    if (lang === 'none') {
      $block.html(block.html);
    } else {
      const hl = lang ? hljs.highlight(lang, text, true) : hljs.highlightAuto(text);

      block.lang = hl.language;

      $block.html(hl.value);
      $block.removeClass();
      $block.addClass(`hljs ${block.lang}`);
    }
  }

  addEditButton(index) {
    const block = this.blocks[index];
    const button = buttonFactory({ lang: block.lang, className: classes.button });
    const $block = $(block.el);

    $block.prepend(ReactServer.renderToString(button));
    $block
      .find(selectors.button)
      .one('click', event => this.addEditInput(index, event));
  }

  addEditInput(index) {
    const block = this.blocks[index];
    const input = inputFactory({ className: classes.input });
    const $block = $(block.el);

    $block.find(selectors.button).remove();
    $block.prepend(ReactServer.renderToString(input));
    $block.parent().addClass(classes.langEdit);

    const $input = $block.find(selectors.input);
    const awesomplete = this.initAwesomplete($input[0]);
    const reset = () => {
      $input.off();
      $input.remove();
      $block.parent().removeClass(classes.langEdit);
      this.initializeBlock(index);
    };

    $input.focus();
    $input.one('awesomplete-select', event => {
      block.lang = awesomplete.replace(event.originalEvent.text);
      block.userEdited = true;
      reset();
      this.savePostBlocks();
    });

    $input.on('blur', reset);
    $input.on('keydown', event => {
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
    if (this.dataEl) {
      const el = ReactDOM.findDOMNode(this.dataEl);

      $(el).find('pre code').each((i, codeEl) => {
        const block = this.blocks[i] || {};
        const $codeEl = $(codeEl);

        $codeEl.find(selectors.button).remove();
        $codeEl.find(selectors.input).remove();

        block.el = codeEl;
        block.text = $codeEl.text();
        block.html = $codeEl.html();
        block.index = i;

        this.blocks[i] = block;
      });

      this.blocks.forEach((_, index) => this.initializeBlock(index));
    }
  }

  clearEventHandlers() {
    const el = ReactDOM.findDOMNode(this.dataEl);
    if (el) {
      $(el).find(selectors.button).off();
      $(el).find(selectors.input).off();
    }
  }

  removeSharing() {
    const el = ReactDOM.findDOMNode(this.dataEl);
    if (el) {
      $('a[title="Like on Facebook"]').parent().remove();
      $('a[href="http://dwf.tw/fluent2016"]').remove();
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
    this.blocks = this.props.post._source.codeBlocks || [];
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
