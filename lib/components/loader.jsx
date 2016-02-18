const React = require('react');
const Spinner = require('./spinner.jsx');
const cls = require('../util').cls;

module.exports = class Loader extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const colors = ['blue', 'red', 'yellow', 'green'];
    const className = cls('loader', this.props.className);
    const spinners = colors.map(color => {
      return <Spinner key={color} color={color}/>;
    });

    return (
      <div className={className}>
        <div className={`preloader-wrapper ${this.props.size} active`}>
          {spinners}
        </div>
      </div>
    );
  }
};
