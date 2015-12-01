const Materialize = window.Materialize;

function toast(msg, type) {
  Materialize.toast(msg, 2000, type);
}

module.exports = class Toast {
  static success(msg) {
    toast(msg, 'success');
  }

  static error(msg) {
    toast(msg, 'error');
  }

  static warn(msg) {
    toast(msg, 'warning');
  }
};
