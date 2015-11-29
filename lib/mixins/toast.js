const Materialize = window.Materialize;

function toast(msg, type) {
  Materialize.toast(msg, 2000, type);
}

module.exports = {
  success(msg) {
    toast(msg, 'success');
  },

  error(msg) {
    toast(msg, 'error');
  }
};
