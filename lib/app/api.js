const $ = require('jquery');

module.exports = class Api {
  static feeds() {
    return $.ajax({
      method: 'GET',
      url: '/api/feeds',
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

  static unsubscribe(feedId) {
    return $.ajax({
      method: 'POST',
      url: `/api/unsubscribe/${feedId}`,
      json: true
    });
  }
};
