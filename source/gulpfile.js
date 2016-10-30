var path = require('path');
var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var notify = require('gulp-notify');
var rename = require('gulp-rename');
var bourbon = require('bourbon').includePaths;
var neat = require('bourbon-neat').includePaths;

var targetPath = path.join(__dirname, '../lms/static/sass');

// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function () {

    // Run in proxy mode with static files also served
    // from current directory + ./app/css
    browserSync.init({
        proxy: 'http://52.51.3.205/',
        serveStatic: ['app/css'],
        snippetOptions: {
            rule: {
                match: /<link.*lms\-main.*>/i,
                fn: function (browserSyncJS, match) {
                    return [
                      '<link rel="stylesheet" type="text/css" href="lms-main-v1.css"/>',
                      browserSyncJS
                    ];
                }
            }
        }
    });


    gulp.watch('app/scss/**/*.scss', ['sass']);
    gulp.watch('app/scss/*.scss', ['sass']);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function () {
    return gulp.src('app/scss/*.scss')
        .pipe(sass({
            // load bourbon and bourbon-neat properly in scss environment
            includePaths: [].concat(
              bourbon,
              neat
            )
        }))
        .on('error', notify.onError('Error: <%= error.message %>'))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.stream())

});

// just copies css to OpenEdX theme specific directory for scss
gulp.task('copy-css', function() {
    return gulp.src('app/css/lms-main-v1.css')
        .pipe(rename('lms-main-v1.scss'))
        .pipe(gulp.dest(targetPath));
});

gulp.task('build', ['sass', 'copy-css']);

gulp.task('default', ['serve']);
