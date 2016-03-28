'use strict';

const Gulp = require('gulp');
const Babel = require('gulp-babel');
const Concat = require('gulp-concat');

Gulp.task('build', function() {
  Gulp.src([
    'lib/serpentity.js',
    'lib/serpentity/entity.js',
    'lib/serpentity/node.js',
    'lib/serpentity/node_collection.js',
    'lib/serpentity/component.js',
    'lib/serpentity/system.js'
  ])
  .pipe(Babel({
    presets: ['es2015']
  }))
  .pipe(Concat('serpentity.js'))
  .pipe(Gulp.dest('dist'));
});
