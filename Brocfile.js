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
  const modulesDir = 'node_modules';
  const vendorFonts = path.join('vendor', 'fonts');
  const vendorStyle = path.join('vendor', 'style');

  const animateCssDir = path.join(modulesDir, 'animate.css');
  const materializeDir = path.join(modulesDir, 'materialize-css');
  const mdiCommunityFontsDir = path.join(vendorFonts, 'mdi');

  const materialize = new Funnel(path.join(materializeDir, 'sass'), {
    destDir: 'materialize',
    include: ['**/*.scss']
  });

  const animateCss = new Funnel(animateCssDir, {
    destDir: 'animate',
    include: ['animate.css'],
    getDestinationPath: () => '_animatecss.scss'
  });

  const mdiCommunityFonts = new Funnel(mdiCommunityFontsDir, { destDir: 'fonts' });
  const mdiCommunityStyle = new Funnel(vendorStyle, {
    destDir: 'mdi',
    include: ['mdi.css'],
    getDestinationPath: () => '_materialdesignicons.scss'
  });

  const sass = new Funnel('style', { destDir: '/', include: ['**/*.scss'] });
  const sassFiles = [sass, materialize, mdiCommunityStyle, animateCss];
  const css = new Sass(sassFiles, 'app.scss', 'app.css');
  const cssPrefixed = new Autoprefixer(css);
  const cssMinified = new UglifyCss(cssPrefixed);

  return new Merge([cssMinified, mdiCommunityFonts]);
}

function buildJs() {
  const vendorRequire = [
    'awesomplete',
    'events',
    'flux',
    'highlight.js',
    'blissfuljs',
    'react-toastr',
    'moment',
    'marked',
    'react',
    'react-dom',
    'react-router',
    'react-tagsinput',
    'trans'
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
    entries: ['app.js'],
    inputNodes: ['lib'],
    outputFile: 'app.js',
    name: 'browserify-lib',
    transforms: [{ name: 'babelify', options: { presets: ['es2015', 'react'] } }]
  });
  const all = new Merge([vendor, lib]);

  return prod ? new UglifyJs(all) : all;
}

function buildAll() {
  const css = buildSass(),
        js = buildJs();

  return new Merge([css, js]);
}

module.exports = buildAll();
