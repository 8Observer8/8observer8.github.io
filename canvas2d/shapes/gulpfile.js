var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('minify', function() {
    return gulp.src('js/*.js')
    .pipe(concat('bundle.min.js'))
    //.pipe(uglify())
    .pipe(gulp.dest('js'));
});