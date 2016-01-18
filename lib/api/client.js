'use strict';

const $ = require('jquery');

function ajax(url, method, data) {
  const opts = { method, url, json: true };

  if (method === 'GET') {
    opts.data = data || {};
  } else {
    opts.contentType = 'application/json';
    opts.data = JSON.stringify(data || {});
  }

  return $.ajax(opts);
}

module.exports = class Api {
  static feeds() {
    return ajax('/api/feeds', 'GET');
  }

  static feedTitles() {
    return ajax('/api/subscription-titles', 'GET');
  }

  static feedPosts(data) {
    return ajax('/api/posts', 'POST', data);
  }

  static posts(data) {
    return ajax('/api/posts', 'POST', data);
  }

  static deleteFeed(feedId) {
    return ajax(`/api/feeds/${feedId}`, 'DELETE');
  }

  static findFeed(uri) {
    return ajax('/api/find-feed', 'GET', { uri });
  }

  static saveTags(tags) {
    return ajax('/api/tags', 'POST', { tags });
  }

  static fetchTags() {
    return ajax('/api/tags', 'GET');
  }

  static deleteTag(tag) {
    return ajax(`/api/tags/${tag}`, 'DELETE');
  }

  static subscribe(feedId) {
    return ajax(`/api/subscribe/${feedId}`, 'POST');
  }

  static unsubscribe(feedId, subscriptionId) {
    return ajax(`/api/unsubscribe/${feedId}/${subscriptionId}`, 'POST');
  }

  static saveSubscription(subscription) {
    return ajax(`/api/subscriptions/${subscription.id}`, 'POST', subscription);
  }

  static savePost(post) {
    return ajax(`/api/posts/${post._id}`, 'POST', post);
  }
};
