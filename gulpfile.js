var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

gulp.task('build', function() {
  gulp.src([
              'lib/serpentity/serpentity.js',
              'lib/serpentity/entity.js',
              'lib/serpentity/node.js',
              'lib/serpentity/node_collection.js',
              'lib/serpentity/component.js',
              'lib/serpentity/system.js',
          ])
    .pipe(uglify())
    .pipe(concat('serpentity.js'))
    .pipe(gulp.dest('dist'))
});
