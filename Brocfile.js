const Funnel = require('broccoli-funnel'),
      path = require('path'),
      Merge = require('broccoli-merge-trees'),
      Sass = require('broccoli-sass'),
      Uglify = require('./broc/uglify'),
      Browserify = require('./broc/browserify'),
      prod = process.env.NODE_ENV === 'production';

function buildSass() {
  const vendorDir = 'node_modules',
        materializeDir = path.join(vendorDir, 'materialize-css/sass'),
        materialize = new Funnel(materializeDir, {
          destDir: 'vendor',
          include: ['**/*.scss']
        }),
        style = new Funnel('style', {
          destDir: '/',
          include: ['**/*.scss']
        });

  return new Sass([style, materialize], 'app.scss', 'app.css');
}

function buildJs() {
  const vendor = new Browserify({
    debug: !prod,
    inputNodes: [ 'node_modules' ],
    outputFile: 'vendor.js',
    require: ['react', 'react-dom']
  });
  const lib = new Browserify({
    debug: !prod,
    external: ['react', 'react-dom'],
    entries: [ 'app.js' ],
    inputNodes: [ 'lib' ],
    outputFile: 'app.js',
    transforms: [{ name: 'babelify', options: { presets: ['es2015', 'react'] } }]
  });
  const all = new Merge([ vendor, lib ]);

  return prod ? new Uglify(all) : all;
}

function buildAll() {
  const css = buildSass(),
        js = buildJs();

  return new Merge([css, js]);
}

module.exports = buildAll();
