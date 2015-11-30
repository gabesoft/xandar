const React = require('react');
const Spinner = require('./spinner.jsx');

module.exports = class Loader extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const colors = ['blue', 'red', 'yellow', 'green'];
    const spinners = colors.map(color => {
      return <Spinner key={color} color={color}/>;
    });

    return (
      <div className={this.props.className + ' loader'}>
        <div className={`preloader-wrapper ${this.props.size} active`}>
          {spinners}
        </div>
      </div>
    );
  }
};
