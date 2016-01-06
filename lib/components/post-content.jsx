const React = require('react');
const ReactDOM = require('react-dom');
const IconBtn = require('./icon-button.jsx');

module.exports = class PostContent extends React.Component {
  onNav(move) {
    const next = move === 'next';
    const method = next ? 'onNext' : 'onPrev';
    const addClasses = next ? ['off-right', 'from-right'] : ['off-left', 'from-left'];
    const delClasses = next ? ['from-left'] : ['from-right'];
    const event = 'animationend';

    const el = ReactDOM.findDOMNode(this);
    const fn = () => {
      this.props[method]();
      el.removeEventListener(event, fn);
    };

    if (el) {
      addClasses.forEach(cls => el.classList.add(cls));
      delClasses.forEach(cls => el.classList.remove(cls));
      el.addEventListener(event, fn);
    }
  }

  componentWillReceiveProps() {
    const el = ReactDOM.findDOMNode(this);
    if (el) {
      el.classList.remove('off-left', 'off-right');
    }
  }

  render() {
    const data = this.props.post;
    const post = data._source.post;
    const html = { __html: post.description };
    return (
      <div className={this.props.className}>
        <div className="post-header">
          <span className="feed-title">{data._source.title}</span>
          <span className="post-title right">{post.title}</span>
        </div>
        <div
          ref={el => this.dataEl = el}
          className="post-content-data"
          dangerouslySetInnerHTML={html}>
        </div>
        <div className="panel-left">
          <IconBtn
            icon="chevron_left"
            title="Previous post"
            size="large"
            disabled={!this.props.hasPrev}
            onClick={() => this.onNav('prev')}
          />
        </div>
        <div className="panel-right">
          <IconBtn
            icon="chevron_right"
            title="Next post"
            size="large"
            disabled={!this.props.hasNext}
            onClick={() => this.onNav('next')}
          />
        </div>
      </div>
    );
  }
};
