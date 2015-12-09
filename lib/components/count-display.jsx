const React = require('react');

module.exports = class CountDisplay extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { value, label } = this.props;
    const show = String(value) !== '0';
    const cls = show ? `count-display ${this.props.className}` : '';
    return (
      <span className={cls}>
        {show ? `${value} ${label}` : ''}
      </span>
    );
  }
};


