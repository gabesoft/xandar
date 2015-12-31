const dispatcher = require('./flux/dispatcher');
const Materialize = window.Materialize;
const ct = require('../constants');
const fc = ct.feeds;

function toast(msg, type) {
  Materialize.toast(msg, 2000, type);
}

class Toast {
  static success(msg) {
    toast(msg, 'success');
  }

  static error(msg) {
    toast(msg, 'error');
  }

  static warn(msg) {
    toast(msg, 'warning');
  }
}

module.exports = {
  toast: Toast,
  setup: () => {
    dispatcher.register(action => {
      const feed = action.feed || action.data.feed || {},
            subscription = feed.subscription || {},
            title = subscription.title || feed.title;

      switch (action.type) {
      case fc.SUBSCRIBE_DONE:
        Toast.success(`Subscribed to feed ${title}`);
        break;
      case fc.SUBSCRIBE_FAIL:
        Toast.error(`Failed to subscribe to feed ${title}`);
        break;
      case fc.UNSUBSCRIBE_DONE:
        Toast.success(`Unsubscribed from feed ${title}`);
        break;
      case fc.UNSUBSCRIBE_FAIL:
        Toast.error(`Failed to unsubscribe from feed ${title}`);
        break;
      case fc.DELETE_DONE:
        Toast.success(`Deleted feed ${title}`);
        break;
      case fc.DELETE_FAIL:
        Toast.error(`Failed to delete feed ${title}`);
        break;
      case fc.FIND_FEED_DONE:
        if (feed.isNew) {
          Toast.success(`Added feed ${feed.title}`);
        } else {
          Toast.warn(`Feed ${feed.title} already exists`);
        }
        break;
      case fc.FIND_FEED_FAIL:
        Toast.error(`Failed to find a feed for ${action.uri}`);
        break;
      default:
        break;
      }
    });
  }
};
