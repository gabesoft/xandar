const React = require('react');

module.exports = class PostContent extends React.Component {
  constructor(props) {
    super(props);
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
        <div className="post-content-data" dangerouslySetInnerHTML={html}></div>
      </div>
    );
  }
};
