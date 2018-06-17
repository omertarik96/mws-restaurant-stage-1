// TODO add build functionality
var gulp = require('gulp'),
    jshint = require('gulp-jshint');

// Default task
gulp.task('default', ['watch']);

// JsHint Task
gulp.task('jshint', function(){
    return gulp.src('js/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('watch', function(){
    gulp.watch('js/**/*.js', ['jshint']);
});
