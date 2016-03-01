const React = require('react');
const App = require('./app.jsx');
const Home = require('./home-page.jsx');
const router = require('react-router');
const Router = router.Router;
const Route = router.Route;
const Redirect = router.Redirect;
const history = require('react-router').browserHistory;

module.exports = class AppRouter extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    /* router.merge(this.props.query, { a: 1 }); */
    /* router.push({a: 1 }); */
    /* console.log(router);
       console.log(Router);
       console.log(this.context.router); */
  }

  render() {
    return (
      <Router history={history}>
        <Redirect from="/" to="/home"/>
        <Route path="/" component={App} user={this.props.user}>
          <Route path="/home" component={Home} user={this.props.user}/>
        </Route>
      </Router>
    );
  }
};
