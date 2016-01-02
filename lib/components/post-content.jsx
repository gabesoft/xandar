const React = require('react');

module.exports = class PostContent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const post = this.props.post._source.post;
    const html = { __html: post.description };
    return (
      <div className={this.props.className} dangerouslySetInnerHTML={html}></div>
    );
  }
};
