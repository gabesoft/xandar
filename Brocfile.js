const Funnel = require('broccoli-funnel'),
      path = require('path'),
      Merge = require('broccoli-merge-trees'),
      Sass = require('broccoli-sass'),
      UglifyJs = require('./broc/uglify-js'),
      UglifyCss = require('./broc/uglify-css'),
      Autoprefixer = require('./broc/autoprefixer'),
      PostCss = require('broccoli-postcss'),
      Browserify = require('./broc/browserify'),
      autoprefixer = require('autoprefixer'),
      prod = process.env.NODE_ENV === 'production';

function buildSass() {
  const vendorDir = 'node_modules';
  const materializeDir = path.join(vendorDir, 'materialize-css');

  const materialize = new Funnel(path.join(materializeDir, 'sass'), {
    destDir: 'vendor',
    include: ['**/*.scss']
  });
  const font = new Funnel(path.join(materializeDir, 'dist/font'), {
    destDir: 'font'
  });
  const sass = new Funnel('style', {
    destDir: '/',
    include: ['**/*.scss']
  });
  const css = new Sass([sass, materialize], 'app.scss', 'app.css');
  const cssPrefixed = new Autoprefixer(css);
  const cssMinified = new UglifyCss(cssPrefixed);

  return new Merge([cssMinified, font]);
}

function buildJs() {
  const vendorRequire = [
    'jquery',
    'react',
    'react-addons-css-transition-group',
    'react-dom',
    'trans'
  ];
  const vendor = new Browserify({
    debug: !prod,
    inputNodes: [ 'node_modules' ],
    outputFile: 'vendor.js',
    require: vendorRequire
  });
  const lib = new Browserify({
    debug: !prod,
    external: vendorRequire,
    entries: [ 'app.js' ],
    inputNodes: [ 'lib' ],
    outputFile: 'app.js',
    transforms: [{ name: 'babelify', options: { presets: ['es2015', 'react'] } }]
  });
  const all = new Merge([ vendor, lib ]);

  return prod ? new UglifyJs(all) : all;
}

function buildAll() {
  const css = buildSass(),
        js = buildJs();

  return new Merge([css, js]);
}

module.exports = buildAll();
