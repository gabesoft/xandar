const React = require('react');

module.exports = class Spinner extends React.Component {
  render() {
    return (
      <div className={`spinner-layer spinner-${this.props.color}`}>
        <div className="circle-clipper left">
          <div className="circle"></div>
        </div><div className="gap-patch">
          <div className="circle"></div>
        </div><div className="circle-clipper right">
          <div className="circle"></div>
        </div>
      </div>
    );
  }
};
