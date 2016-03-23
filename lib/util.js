'use strict';

let count = 1;

const colors = [
  'blue',
  'cyan',
  'green',
  'magenta',
  'orange',
  'red',
  'violet',
  'yellow'
];

const fullscreenChangeNames = [
  'webkitfullscreenchange',
  'mozfullscreenchange',
  'fullscreenchange',
  'MSFullscreenChange'
];

function transitionEndEventName() {
  const el = document.createElement('div'),
        transitions = {
          transition: 'transitionend',
          OTransition: 'otransitionend',
          MozTransition: 'transitionend',
          WebkitTransition: 'webkitTransitionEnd'
        };

  let i;

  for (i in transitions) {
    if (transitions.hasOwnProperty(i) && el.style[i] !== undefined) {
      return transitions[i];
    }
  }
}

class DelaySeries {
  constructor(duration) {
    this.duration = duration || 0;
    this.id = null;
  }

  clear() {
    clearTimeout(this.id);
  }

  run(fn, duration) {
    clearTimeout(this.id);
    this.id = setTimeout(fn, duration || this.duration);
  }
}

function wait(delay) {
  return new Promise(resolve => setTimeout(resolve, delay || 0));
}

function isSmallScreen() {
  const match = window.matchMedia('only screen and (max-width: 760px)');
  return match && match.matches;
}

function debounce(args) {
  let timer = null;
  const { fn, delay } = args;
  return function debounced() {
    const context = this;
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(context, args);
    }, delay);
  };
}

function capitalize(input) {
  input = input || '';
  return input.charAt(0).toUpperCase() + input.slice(1);
}

function cls(...classes) {
  return classes.filter(Boolean).join(' ');
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

function getInitials(text) {
  text = text || '';

  const words = text
          .replace(/\W/g, ' ')
          .split(/\s+/)
          .filter(Boolean);

  if (words.length === 0) {
    return '---';
  } else if (words.length === 1) {
    return words[0][0] + (words[0][1] || '_');
  } else {
    return words[0][0] + words[1][0];
  }
}

function hashCode(text) {
  text = text || '';

  const len = text.length;
  let hash = 0,
      i = 0,
      code;

  if (len === 0) return hash;

  for (i = 0; i < len; i++) {
    code = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + code;
    hash |= 0; // Convert to 32bit integer
  }

  return hash;
}

function getColor(text) {
  const index = Math.abs(hashCode(text) % colors.length);
  return colors[index];
}

module.exports = {
  addFullscreenChangeListener,
  capitalize,
  cls,
  debounce,
  fullscreenEnter,
  fullscreenExit,
  fullscreenOff: () => !fullscreenOn(),
  fullscreenOn,
  genId: () => count++,
  getInitials,
  getColor,
  isSmallScreen,
  makeSelectors,
  regexpEscape,
  removeFullscreenChangeListener,
  transitionEndEventName,
  wait,
  DelaySeries
};
