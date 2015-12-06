const React = require('react');

module.exports = class NavSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: '' };
    this.onClear = this.onClear.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onClear() {
    this.setState({ value: '' });
  }

  onChange(event) {
    this.setState({ value: event.target.value });
  }

  render() {
    return (
      <form className="search-form">
        <div className="input-field">
          <input
            id="search"
            type="search"
            value={this.state.value}
            onChange={this.onChange}
            required/>
          <label htmlFor="search">
            <i className="material-icons">search</i>
          </label>
          <i onClick={this.onClear} className="material-icons">
            close
          </i>
        </div>
      </form>
    );
  }
};

