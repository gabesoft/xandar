'use strict';

const React = require('react');
const IconBtn = require('./icon-button.jsx');

module.exports = class PostQuery extends React.Component {
  constructor(props) {
    super(props);
    this.onTitleEdit = this.onTitleEdit.bind(this);
    this.onTitleChange = this.onTitleChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.state = {
      edit: false,
      title: this.props.query.title,
      pin: this.props.query.pin
    };
  }

  onPin(pin) {
    this.setState({ pin });
    this.props.onPin(this.props.query, pin);
  }

  onTitleChange(event) {
    const title = event.target.value;

    this.setState({ title });
    this.props.onTitleChange(this.props.query, title);
  }

  onTitleEdit() {
    this.setState({ edit: !this.state.edit });
  }

  renderActions() {
    const pinBtn = (
      <IconBtn icon="turned_in_not" title="Pin" onClick={() => this.onPin(1)}/>
    );
    const unpinBtn = (
      <IconBtn icon="turned_in" title="Pinned (click to unpin)" onClick={() => this.onPin(0)}/>
    );

    return (
      <div className="post-query-actions">
        <IconBtn icon="edit" title="Edit title" onClick={this.onTitleEdit}/>
        {this.state.pin === 0 ? pinBtn : unpinBtn}
      </div>
    );
  }

  onKeyDown(event) {
    if (event.which === 13) {
      this.onTitleEdit();
    }
  }

  render() {
    const query = this.props.query;
    const titleClass = this.state.title ? 'title' : 'text';
    const editInput = (
      <input
        autoFocus
        type="text"
        value={this.state.title}
        onChange={this.onTitleChange}
        onBlur={this.onTitleEdit}
        onKeyDown={this.onKeyDown}
        className="edit-input"
      />
    );
    const title = (
      <span className={titleClass} title={query.text} onClick={() => this.props.onClick(query)}>
        {this.state.title || query.text}
      </span>
    );

    return (
      <li className="collection-item">
        {this.state.edit ? editInput : title}
        {this.renderActions()}
      </li>
    );
  }
};
