function debounce(fn, delay) {
  let timer = null;
  return function debounced() {
    const context = this, args = arguments;
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(context, args);
    }, delay);
  };
}

module.exports = {
  debounce: debounce
};
