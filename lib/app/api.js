const $ = require('jquery');

module.exports = class Api {
  static feeds() {
    return $.ajax({
      method: 'GET',
      url: '/api/feeds',
      json: true
    });
  }

  static feedPosts(feedId, limit) {
    return $.ajax({
      method: 'GET',
      url: '/api/posts',
      data: { feedId: feedId, limit: limit },
      json: true
    });
  }

  static deleteFeed(feedId) {
    return $.ajax({
      method: 'DELETE',
      url: `/api/feeds/${feedId}`,
      json: true
    });
  }

  static subscribe(feedId) {
    return $.ajax({
      method: 'POST',
      url: `/api/subscribe/${feedId}`,
      json: true
    });
  }

  static unsubscribe(feedId, subscriptionId) {
    return $.ajax({
      method: 'POST',
      url: `/api/unsubscribe/${feedId}/${subscriptionId}`,
      json: true
    });
  }
};
