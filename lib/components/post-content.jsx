const React = require('react');
const ReactDOM = require('react-dom');
const IconBtn = require('./icon-button.jsx');

module.exports = class PostContent extends React.Component {
  constructor(props) {
    super(props);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

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

      const contentEl = el.querySelector('.post-content-data');
      if (contentEl) {
        contentEl.scrollTop = 0;
      }
    }
  }

  componentWillReceiveProps() {
    const el = ReactDOM.findDOMNode(this);
    if (el) {
      el.classList.remove('off-left', 'off-right');
    }
  }

  onKeyDown(event) {
    if (event.which === 37) {
      this.onNav('prev');
    } else if (event.which === 39) {
      this.onNav('next');
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);
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
