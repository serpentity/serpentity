'use strict';

let gulp = require('gulp');
let concat = require('gulp-concat');

gulp.task('build', function() {
  gulp.src([
    'lib/serpentity.js',
    'lib/serpentity/entity.js',
    'lib/serpentity/node.js',
    'lib/serpentity/node_collection.js',
    'lib/serpentity/component.js',
    'lib/serpentity/system.js'
  ])
    .pipe(concat('serpentity.js'))
    .pipe(gulp.dest('dist'));
});
