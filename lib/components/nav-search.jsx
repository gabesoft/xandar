const React = require('react');
const actions = require('../flux/nav-actions');

module.exports = class NavSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: '' };
    this.onClear = this.onClear.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onClear() {
    this.setState({ value: '' });
    actions.feedSearch('');
  }

  onChange(event) {
    const query = event.target.value;
    this.setState({ value: query });
    actions.feedSearch(query);
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

