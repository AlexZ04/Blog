const gulp = require('gulp');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const less = require('gulp-less');

const browserSync = require('browser-sync').create();

const lessFiles = [
    './src/styles/pages.less',
    './src/styles/header.less',
    './src/styles/footer.less',
    './src/styles/passwordControl.less',
    './src/styles/login.less',
    './src/styles/registration.less'
]

function styles() {
    return gulp.src(lessFiles)
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(concat('style.css'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./build/style'))
    .pipe(browserSync.stream());
}

function watch() {
    browserSync.init({
        server: {
            baseDir: './'
        }
    });
    gulp.watch('./src/styles/**/*.less', styles);
    gulp.watch('./*.less').on('change', browserSync.reload);
    gulp.watch('./**/*.html').on('change', browserSync.reload);
    gulp.watch('./**/*.js').on('change', browserSync.reload);
}

gulp.task('styles', styles);
gulp.task('watch', watch);

gulp.task('dev', gulp.series('styles','watch'));
