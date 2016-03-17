'use strict';

const React = require('react');
const Toastr = require('react-toastr');
const ToastContainer = Toastr.ToastContainer;
const MessageFactory = React.createFactory(Toastr.ToastMessage.animation);
const dispatcher = require('../flux/dispatcher');
const constants = require('../constants');
const timeOut = 5000;
const extendedTimeOut = 10000;

module.exports = class Toast extends React.Component {
  addMessage(message, type) {
    this.refs.container[type](null, message, { timeOut, extendedTimeOut });
  }

  success(message) {
    this.addMessage(message, 'success');
  }

  info(message) {
    this.addMessage(message, 'info');
  }

  error(message) {
    this.addMessage(message, 'error');
  }

  warning(message) {
    this.addMessage(message, 'warning');
  }

  componentWillUnmount() {
    dispatcher.unregister(this.tokenId);
  }

  componentDidMount() {
    this.tokenId = dispatcher.register(action => {
      let feed = null;

      switch (action.type) {
        case constants.feeds.SUBSCRIBE_DONE:
          this.success(`Subscribed to feed ${action.feed.title}`);
          break;
        case constants.feeds.SUBSCRIBE_FAIL:
          this.error(`Failed to subscribe to feed ${action.feed.title}`);
          break;
        case constants.feeds.UNSUBSCRIBE_DONE:
          this.success(`Unsubscribed from feed ${action.feed.title}`);
          break;
        case constants.feeds.UNSUBSCRIBE_FAIL:
          this.error(`Failed to unsubscribe from feed ${action.feed.title}`);
          break;
        case constants.feeds.DELETE_FEED_DONE:
          this.success(`Deleted feed ${action.feed.title}`);
          break;
        case constants.feeds.DELETE_FEED_FAIL:
          this.error(`Failed to delete feed ${action.feed.title}`);
          break;
        case constants.posts.CAROUSEL_AT_TOP:
          this.warning('At top');
          break;
        case constants.posts.CAROUSEL_AT_END:
          this.warning('At end');
          break;
        case constants.feeds.ADD_FEED_DONE:
          feed = action.data.feed;
          if (feed.isNew) {
            this.success(`Added feed ${feed.title}`);
          } else {
            this.warning(`Feed ${feed.title} already exists`);
          }
          break;
        case constants.feeds.ADD_FEED_FAIL:
          this.error(`Failed to find a feed for ${action.uri}`);
          break;
        default:
          break;
      }
    });
  }

  render() {
    return (
      <ToastContainer
        closeButton
        ref="container"
        toastMessageFactory={MessageFactory}
        className="toast-top-right" />
    );
  }
};
