const $ = require('jquery');

module.exports = class Api {
  static feeds() {
    return $.ajax({
      url: '/api/feeds',
      json: true
    });
  }
};
