const React = require('react');

module.exports = class App extends React.Component {
  render() {
    return (
      <div className="app-main">
        {this.props.children}
      </div>
    );
  }
};
