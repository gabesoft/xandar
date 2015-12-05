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

  static findFeed(uri) {
    return $.ajax({
      method: 'GET',
      url: '/api/find-feed',
      data: { uri: uri },
      json: true
    });
  }

  static saveTags(tags) {
    return $.ajax({
      method: 'POST',
      url: '/api/tags',
      data: { tags },
      json: true
    });
  }

  static fetchTags() {
    return $.ajax({
      method: 'GET',
      url: '/api/tags',
      json: true
    });
  }

  static deleteTag(tag) {
    return $.ajax({
      method: 'DELETE',
      url: `/api/tags/${tag}`,
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

  static saveSubscription(subscription) {
    return $.ajax({
      method: 'POST',
      url: `/api/subscriptions/${subscription.id}`,
      data: subscription,
      json: true
    });
  }
};
