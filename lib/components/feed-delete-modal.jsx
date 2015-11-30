const React = require('react');
const Modal = require('react-modal');

module.exports = class FeedDeleteModal extends React.Component {
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
        <div className="modal-content">
          <h5>Delete Feed Confirmation</h5>
          <p>
            Are you sure you want to delete the feed <b>{this.props.feed.title}</b> and all its posts?
          </p>
        </div>
        <div className="modal-footer">
          <a
            onClick={this.props.onAcceptClick}
            className="modal-action modal-close waves-effect waves-teal btn-flat"
            href="javascript:void(0)">
            Delete
          </a>
          <a
            onClick={this.props.onCancelClick}
            className="modal-action modal-close waves-effect waves-teal btn-flat"
            href="javascript:void(0)">
            Cancel
          </a>
        </div>
      </Modal>
    );
  }
};
