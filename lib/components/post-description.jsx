'use strict';


const classes = {
  button: 'btn-highlight',
  input: 'input-highlight',
  langEdit: 'lang-edit-mode',
  description: 'post-description'
};

const makeSelectors = require('../util').makeSelectors;
const selectors = makeSelectors(classes);

const React = require('react');
const ReactDOM = require('react-dom');
const ReactServer = require('react-dom/server');
const escape = require('../util').regexpEscape;
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


module.exports = class PostDescription extends React.Component {
  constructor(props) {
    super(props);
    this.blocks = this.props.post._source.codeBlocks || [];
    this.onIframeLoaded = this.onIframeLoaded.bind(this);
    this.state = { loading: true };
  }

  onIframeLoaded() {
    this.setState({ loading: false });
  }

  savePostBlocks() {
    const post = this.props.post;
    post._source.codeBlocks = this.blocks.map(block => ({ lang: block.lang }));
    actions.savePost(post);
  }

  renderLoader() {
    return (<Loader size="big" className="post-content-loader"/>);
  }

  renderIframe(src) {
    const post = this.props.post._source.post;
    const html = { __html: post.description };

    return (
      <div className={classes.description}>
        {this.state.loading ? this.renderLoader() : null}
        <iframe
          src={src}
          onLoad={this.onIframeLoaded}
          allowFullScreen
        />
        <div className={classes.description}>
          <div dangerouslySetInnerHTML={html}></div>
        </div>
      </div>
    );
  }

  processYoutube() {
    const post = this.props.post._source.post;
    const link = post.link || '';
    const match = link.match(/http:\/\/www.youtube.com\/watch\?v=(.+)$/);

    if (match) {
      const src = `https://youtube.com/embed/${match[1]}`;
      return this.renderIframe(src);
    }
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

  processDefault() {
    const post = this.props.post._source.post;
    const html = { __html: post.description };
    return (
      <div className={classes.description}>
        <div ref={el => this.dataEl = el} dangerouslySetInnerHTML={html}></div>
      </div>
    );
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

  highlightBlock(index) {
    const block = this.blocks[index];
    const $block = $(block.el);
    const lang = block.lang;
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
      reset();
      this.savePostBlocks();
    });

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

  componentDidMount() {
    this.initializeCodeBlocks();
  }

  componentWillUpdate() {
    this.clearEventHandlers();
  }

  componentDidUpdate() {
    this.blocks = this.props.post._source.codeBlocks || [];
    this.initializeCodeBlocks();
  }

  componentWillUnmount() {
    this.clearEventHandlers();
  }

  render() {
    const processors = feeds.map(feed => () => this.processMissingContent(feed));

    processors.push(() => this.processHackerNews());
    processors.push(() => this.processYoutube());
    processors.push(() => this.processDefault());

    return (processors.find(process => process())());
  }
};
