const React = require('react');
const Modal = require('react-modal');

module.exports = class FeedAddModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = { uri: null };
    this.onChange = this.onChange.bind(this);
    this.onAccept= this.onAccept.bind(this);
  }

  onAccept(event) {
    this.props.onAcceptClick(this.state.uri);
    event.preventDefault();
  }

  onChange(event) {
    this.setState({ uri: event.target.value });
  }

  render() {
    const styles = {
      overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        zIndex: 1000
      },
      content: {
        backgroundColor: 'rgb(250, 250, 250)',
        bottom: 'auto'
      }
    };

    return (
      <Modal
        isOpen={this.props.isOpen}
        onRequestClose={this.props.onCancelClick}
        closeTimeoutMS={150}
        className="modal"
        style={styles}>
        <form onSubmit={this.onAccept}>
          <div className="modal-content">
            <h5>Add a new feed</h5>
            <div className="input-field">
              <input
                id="feed-url"
                type="url"
                className="validate"
                pattern="https?://.+" required
                onChange={this.onChange}
              />
              <label htmlFor="feed-url" data-error="Invalid url">Feed url</label>
            </div>
          </div>
          <div className="modal-footer">
            <a
              onClick={this.onAccept}
              className="modal-action modal-close waves-effect waves-teal btn-flat"
              href="javascript:void(0)">
              Submit
            </a>
            <a
              onClick={this.props.onCancelClick}
              className="modal-action modal-close waves-effect waves-teal btn-flat"
              href="javascript:void(0)">
              Cancel
            </a>
          </div>
        </form>
      </Modal>
    );
  }
};
