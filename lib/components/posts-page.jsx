const React = require('react');
const Posts = require('./post-list.jsx');

module.exports = class FeedsPage extends React.Component {
  render() {
    return (<Posts/>);
  }
};
