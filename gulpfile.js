var gulp = require('gulp');

var jshint = require('gulp-jshint');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

gulp.task('jshint', function() {
    return gulp.src('js/DeepShare.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('uglify', ['jshint'], function() {
    gulp.src('js/DeepShare.js')
        .pipe(rename('DeepShare_v1.5.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('js'));
});

gulp.task('default', ['uglify'] );
