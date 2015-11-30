const React = require('react');
const IconBtn = require('./icon-button.jsx');
const Modal = require('./feed-delete-modal.jsx');

module.exports = class FeedActions extends React.Component {
  constructor(props) {
    super(props);
    this.state = { modalIsOpen: false };
  }

  onOpenFeed() {
    return false;
  }

  onDeleteAttempt() {
    this.setState({ modalIsOpen: true });
  }

  onDeleteAccept() {
    this.setState({ modalIsOpen: false });
    this.props.onDelete();
  }

  onDeleteCancel() {
    this.setState({ modalIsOpen: false });
  }

  renderSubscribeBtn() {
    return (
      <IconBtn
        onClick={this.props.onSubscribe}
        icon="add_circle_outline"
        title="Subscribe to this feed"/>
    );
  }

  renderUnsubscribeBtn() {
    return (
      <IconBtn
        onClick={this.props.onUnsubscribe}
        icon="remove_circle_outline"
        title="Unsubscribe from this feed"/>
    );
  }

  render() {
    const { feed, className } = this.props;

    return (
      <div className={className}>
        {feed.subscription ? this.renderUnsubscribeBtn() : this.renderSubscribeBtn()}
        <IconBtn
          icon="open_in_new"
          title="Open feed in new window"
          href={feed.link}
          onClick={this.onOpenFeed}
          target="_blank"/>
        <IconBtn
          icon="delete"
          title="Delete this feed"
          onClick={this.onDeleteAttempt.bind(this)}
          className="error"/>
        <Modal
          isOpen={this.state.modalIsOpen}
          feed={this.props.feed}
          onAcceptClick={this.onDeleteAccept.bind(this)}
          onCancelClick={this.onDeleteCancel.bind(this)}/>
      </div>
    );
  }
};
