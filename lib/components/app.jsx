const React = require('react');
const FeedList = require('./feed-list.jsx');

module.exports = React.createClass({
  propTypes: {},
  render: function render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col s12 m12 l12">
            <FeedList/>
          </div>
        </div>
      </div>
    );
  }
});
