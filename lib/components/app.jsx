const React = require('react');
const router = require('react-router');
const Link = router.Link;

module.exports = class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <ul>
            <li><Link to="/feeds">Feeds</Link></li>
            <li><Link to="/posts">Posts</Link></li>
          </ul>
        </div>
        <div className="row">
          {this.props.children}
        </div>
      </div>
    );
  }
};
