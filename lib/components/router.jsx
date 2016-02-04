const React = require('react');
const App = require('./app.jsx');
const Feeds = require('./feeds-page.jsx');
const Posts = require('./posts-page.jsx');
const Home = require('./home-page.jsx');
const router = require('react-router');
const Router = router.Router;
const Route = router.Route;
const Redirect = router.Redirect;
const history = require('../history');

module.exports = class AppRouter extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router history={history}>
        <Redirect from="/" to="/home"/>
        <Route path="/" component={App} user={this.props.user}>
          <Route path="/feeds" component={Feeds} user={this.props.user}/>
          <Route path="/posts" component={Posts} user={this.props.user}/>
          <Route path="/home" component={Home} user={this.props.user}/>
        </Route>
      </Router>
    );
  }
};
