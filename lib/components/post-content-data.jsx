'use strict';

const React = require('react');
const escape = require('../util').regexpEscape;

module.exports = class PostContentData extends React.Component {
  processYoutube() {
    const post = this.props.post._source.post;
    const link = post.link || '';
    const match = link.match(/http:\/\/www.youtube.com\/watch\?v=(.+)$/);

    if (match) {
      const shareUrl = `https://youtube.com/embed/${match[1]}`;
      return (
        <div className="post-content-data">
          <iframe src={shareUrl} allowFullScreen/>
        </div>
      );
    }
  }

  processMissingContent(pattern) {
    const post = this.props.post._source.post;
    const link = post.link || '';
    const regex = new RegExp(escape(pattern));
    const match = link.match(regex);

    if (match) {
      return (
        <div className="post-content-data">
          <iframe src={link}/>
        </div>
      );
    }
  }

  processDefault() {
    const post = this.props.post._source.post;
    const html = { __html: post.description };

    return (
      <div
        ref={el => this.dataEl = el}
        className="post-content-data"
        dangerouslySetInnerHTML={html}>
      </div>
    );
  }

  render() {
    const processors = [
      () => this.processYoutube(),
      () => this.processMissingContent('paulgraham.com'),
      () => this.processMissingContent('bennadel.com/blog'),
      () => this.processMissingContent(`blog.aaronbieber.com`),
      () => this.processMissingContent('tothenew.com/blog'),
      () => this.processDefault()
    ];

    const el = processors.find(process => process());

    return (el());
  }
};
