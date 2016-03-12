'use strict';

const $ = window.$;

function queryParams(data) {
  data = data || {};
  return Object.keys(data)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join('&');
}

function ajax(url, method, data) {
  const opts = { method, responseType: 'json' };

  if (method === 'GET') {
    opts.data = queryParams(data);
  } else {
    opts.headers = { 'Content-type': 'application/json' };
    opts.data = JSON.stringify(data || {});
  }

  return $.fetch(url, opts).then(xhr => {
    return xhr.response;
  });
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

  static postQueries(data) {
    return ajax('/api/search/post-queries', 'POST', data);
  }

  static deleteFeed(feedId) {
    return ajax(`/api/feeds/${feedId}`, 'DELETE');
  }

  static addFeed(uri) {
    return ajax('/api/add-feed', 'POST', { uri });
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
    return ajax('/api/subscriptions', 'PUT', { feedId });
  }

  static unsubscribe(subscriptionId) {
    return ajax(`/api/subscriptions/${subscriptionId}`, 'DELETE');
  }

  static saveSubscription(subscription) {
    return ajax(`/api/subscriptions/${subscription.id}`, 'POST', subscription);
  }

  static markPostsAsRead(subscription) {
    return ajax(`/api/mark-posts-as-read/${subscription.id}`, 'POST', subscription);
  }

  static savePost(post) {
    return ajax(`/api/posts/${post._id}`, 'POST', post);
  }

  static savePostQuery(query) {
    return ajax('/api/post-queries', 'POST', query);
  }
};
