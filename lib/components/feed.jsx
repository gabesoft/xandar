const React = require('react');

module.exports = React.createClass({
  render() {
    return (
      <li className="feed-item collection-item">
        <div className="info truncate">
          <div className="title truncate">
            {this.props.title}
          </div>
          <div className="author hide-on-small-only">
            {this.props.author ? '- ' + this.props.author : ''}
          </div>
        </div>
        <div className="post-count badge">
          {this.props.postCount}
        </div>
      </li>
    );
  }
});
