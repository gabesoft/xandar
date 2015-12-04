const Funnel = require('broccoli-funnel'),
      trans = require('trans'),
      path = require('path'),
      Merge = require('broccoli-merge-trees'),
      Sass = require('broccoli-sass'),
      UglifyJs = require('./broc/uglify-js'),
      UglifyCss = require('./broc/uglify-css'),
      Autoprefixer = require('./broc/autoprefixer'),
      Browserify = require('./broc/browserify'),
      prod = process.env.NODE_ENV === 'production';

function buildSass() {
  const vendorDir = 'node_modules';
  const materializeDir = path.join(vendorDir, 'materialize-css');
  const materialFontsDir = path.join(vendorDir, 'material-design-icons', 'iconfont');
  const robotoFontsDir = path.join(materializeDir, 'dist', 'font', 'roboto');

  const materialize = new Funnel(path.join(materializeDir, 'sass'), {
    destDir: 'materialize',
    include: ['**/*.scss']
  });
  const materialFonts = new Funnel(materialFontsDir, { destDir: 'font/icons' });
  const robotoFonts = new Funnel(robotoFontsDir, { destDir: 'font/roboto' });
  const sass = new Funnel('style', {
    destDir: '/',
    include: ['**/*.scss']
  });
  const css = new Sass([sass, materialize], 'app.scss', 'app.css');
  const cssPrefixed = new Autoprefixer(css);
  const cssMinified = new UglifyCss(cssPrefixed);

  return new Merge([cssMinified, materialFonts, robotoFonts]);
}

function buildJs() {
  const vendorRequire = [
    'awesomplete',
    'events',
    'flux',
    'hammerjs',
    'jquery',
    'materialize-css/js/forms',
    'materialize-css/js/global',
    'materialize-css/js/toasts',
    'materialize-css/js/waves',
    'moment',
    'react',
    'react-addons-transition-group',
    'react-dom',
    'react-modal',
    'react-tagsinput',
    'trans',
    'velocity-animate',
    'velocity-animate/velocity.ui',
    'velocity-react/velocity-component',
    'velocity-react/velocity-helpers',
    'velocity-react/velocity-transition-group'
  ];
  const vendor = new Browserify({
    debug: !prod,
    inputNodes: trans(vendorRequire)
      .map('.', ['replace', /\/[^/]*$/, ''])
      .uniq()
      .map('.', dir => path.join('node_modules', dir))
      .value(),
    outputFile: 'vendor.js',
    name: 'browserify-vendor',
    require: vendorRequire
  });
  const lib = new Browserify({
    debug: !prod,
    external: vendorRequire,
    entries: [ 'app.js' ],
    inputNodes: [ 'lib' ],
    outputFile: 'app.js',
    name: 'browserify-lib',
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
