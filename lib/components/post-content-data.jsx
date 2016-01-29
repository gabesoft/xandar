'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const escape = require('../util').regexpEscape;
const Awesomplete = require('awesomplete');
const Loader = require('./loader.jsx');
const $ = require('jquery');
const langs = require('../lang');
const actions = require('../flux/post-actions');
const hljs = require('highlight.js');

module.exports = class PostContentData extends React.Component {
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
    return (<Loader size="medium" className="post-content-loader"/>);
  }

  processYoutube() {
    const post = this.props.post._source.post;
    const link = post.link || '';
    const match = link.match(/http:\/\/www.youtube.com\/watch\?v=(.+)$/);

    if (match) {
      const shareUrl = `https://youtube.com/embed/${match[1]}`;

      return (
        <div className="post-content-data">
          {this.state.loading ? this.renderLoader() : null}
          <iframe src={shareUrl} onLoad={this.onIframeLoaded} allowFullScreen/>
        </div>
      );
    }
  }

  processMissingContent(pattern) {
    const post = this.props.post._source.post;
    const link = post.link || '';
    const regex = new RegExp(escape(pattern), 'i');
    const match = link.match(regex);

    if (match) {
      return (
        <div className="post-content-data">
          {this.state.loading ? this.renderLoader() : null}
          <iframe onLoad={this.onIframeLoaded} src={link}/>
        </div>
      );
    }
  }

  processDefault() {
    const post = this.props.post._source.post;
    const html = { __html: post.description };
    return (
      <div className="post-content-data">
        <div ref={el => this.dataEl = el} dangerouslySetInnerHTML={html}></div>
      </div>
    );
  }

  initAwesomplete(input) {
    const awesomplete = new Awesomplete(input);
    const $$ = Awesomplete.$;

    awesomplete.list = langs.map(ln => `${ln[1]}:${ln[0]}`);
    awesomplete.autoFirst = true;
    awesomplete.minChars = 1;
    awesomplete.item = (text, search) => {
      const value = RegExp($$.regExpEscape(search.trim()), 'gi');
      const textParts = text.split(/:/);
      const valueHtml = textParts[0].replace(value, '<mark>$&</mark>');
      return $$.create('li', {
        innerHTML: `<span class="value">${valueHtml}</span><span class="separator">:</span><span class="name">${textParts[1]}</span>`,
        'aria-selected': false
      });
    };

    awesomplete.filter = (text, inputStr) => {
      const value = text.split(/:/)[0];
      return Awesomplete.FILTER_CONTAINS(value, inputStr);
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

    if (lang === 'none') {
      $block.html(block.html);
    } else {
      const hl = lang ? hljs.highlight(lang, text, true) : hljs.highlightAuto(text);

      hl.value = hljs.fixMarkup(hl.value);
      block.lang = hl.language;

      $block.html(hl.value);
      $block.removeClass();
      $block.addClass(`hljs ${block.lang}`);
    }
  }

  addEditButton(index) {
    const block = this.blocks[index];
    const lang = block.lang;
    const $block = $(block.el);
    const buttonHtml = `<a class="waves-effect waves-teal btn-flat btn-icon tooltipped btn-highlight"'>${lang || "unknown"}</a>`;

    $block.prepend(buttonHtml);
    $block.find('.btn-highlight').one('click', event => this.addEditInput(index, event));
  }

  addEditInput(index) {
    const block = this.blocks[index];
    const $block = $(block.el);
    const inputHtml = `<input class="input-highlight" type="text" value=""/>`;

    $block.find('.btn-highlight').remove();
    $block.prepend(inputHtml);
    $block.parent().addClass('lang-edit-mode');

    const $input = $block.find('.input-highlight');
    const awesomplete = this.initAwesomplete($input[0]);

    $input.focus();
    $input.one('awesomplete-select', event => {
      block.lang = awesomplete.replace(event.originalEvent.text);
      $input.off();
      $input.remove();
      $block.parent().removeClass('lang-edit-mode');
      this.highlightBlock(index);
      this.addEditButton(index);
      this.savePostBlocks();
    });

    $input.on('keydown', event => {
      if (event.which === 27) {
        // TODO: centralize duplication with the above handler
        $input.off();
        $input.remove();
        $block.parent().removeClass('.lang-edit-mode');
        this.highlightBlock(index);
        this.addEditButton(index);
      }
    });
  }

  componentDidMount() {
    if (this.dataEl) {
      const el = ReactDOM.findDOMNode(this.dataEl);
      const $pre = $(el).find('pre code');

      $pre.each((i, pre) => {
        this.blocks[i] = this.blocks[i] || {};
        this.blocks[i].el = pre;
        this.blocks[i].text = $(pre).text();
        this.blocks[i].html = $(pre).html();
      });

      this.blocks.forEach((block, index) => {
        this.highlightBlock(index);
        this.addEditButton(index);
      });
    }
  }

  componentWillUnmount() {
    const el = ReactDOM.findDOMNode(this.dataEl);
    if (el) {
      $(el).find('.btn-highlight').off();
      $(el).find('.input-highlight').off();
    }
  }

  render() {
    const processors = [
      () => this.processYoutube(),
      () => this.processMissingContent('bennadel.com/blog'),
      () => this.processMissingContent('blog.aaronbieber.com'),
      () => this.processMissingContent('bocoup'),
      () => this.processMissingContent('creativebloq'),
      () => this.processMissingContent('digitalbookworld.com'),
      () => this.processMissingContent('lostechies'),
      () => this.processMissingContent('paulgraham.com'),
      () => this.processMissingContent('sitepoint.com'),
      () => this.processMissingContent('strongloop.com'),
      () => this.processMissingContent('thenextweb'),
      () => this.processMissingContent('tothenew.com/blog'),
      () => this.processDefault()
    ];

    const el = processors.find(process => process());

    return (el());
  }
};
