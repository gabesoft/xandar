'use strict';

let count = 1;

const fullscreenChangeNames = [
  'webkitfullscreenchange',
  'mozfullscreenchange',
  'fullscreenchange',
  'MSFullscreenChange'
];

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

function timeout(delay) {
  return new Promise(resolve => setTimeout(resolve, delay));
}

function regexpEscape(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}

function fullscreenEnter(el) {
  if (el) {
    if (el.requestFullscreen) {
      el.requestFullscreen();
    } else if (el.msRequestFullscreen) {
      el.msRequestFullscreen();
    } else if (el.mozRequestFullScreen) {
      el.mozRequestFullScreen();
    } else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
    }
  }
}

function fullscreenExit() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}

function addFullscreenChangeListener(fn) {
  fullscreenChangeNames.forEach(name => document.addEventListener(name, fn, false));
}

function removeFullscreenChangeListener(fn) {
  fullscreenChangeNames.forEach(name => document.removeEventListener(name, fn));
}

function fullscreenOn() {
  const names = [
    'fullscreenElement',
    'mozFullScreenElement',
    'webkitFullscreenElement',
    'msFullscreenElement'
  ];
  return names.some(name => (name in document) && document[name]);
}

function makeSelectors(classes) {
  return Object.keys(classes || {}).reduce((acc, key) => {
    acc[key] = `.${classes[key]}`;
    return acc;
  }, {});
}

module.exports = {
  addFullscreenChangeListener,
  debounce,
  fullscreenEnter,
  fullscreenExit,
  fullscreenOff: () => !fullscreenOn(),
  fullscreenOn,
  genId: () => count++,
  makeSelectors,
  regexpEscape,
  removeFullscreenChangeListener,
  timeout
};
