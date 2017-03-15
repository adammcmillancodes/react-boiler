const gulp = require('gulp');
const sass = require('gulp-sass');
const babel = require('babelify');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const browserSync = require('browser-sync');
const reload = browserSync.reload;
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');

gulp.task('styles', () => {
    return gulp.src('./dev/styles/**/*.scss') // '**' any folder inside of, '*' any file with the extension of .scss
        .pipe(sass().on('error', sass.logError)) // on Error display message: 'error'
        .pipe(concat('style.css'))
        .pipe(gulp.dest('./public/styles'));
});

gulp.task('js', () => {
	browserify('src/app.js', {debug: true})
		.transform('babelify', {
			sourceMaps: true,
            presets: ['es2015','react']
        })
        .bundle()
        .on('error',notify.onError({
            message: "Error: <%= error.message %>",
            title: 'Error in JS 💀'
        }))
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(gulp.dest('public/'))
        .pipe(reload({stream:true}));
});

gulp.task('bs', () => {
    browserSync.init({
        server: {
            baseDir: './'
        }
    });
});

gulp.task('watch', () => {
    return gulp.watch('./dev/styles/**/*.scss', ['styles']);
    // return gulp.watch('./dev/scripts/**/*.js', ['javascript']);
});
gulp.task('default', ['styles', 'javascript', 'watch']) 

// gulp.task('default', ['styles','js','bs'], () => {
//     gulp.watch('src/**/*.js',['js']);
//     gulp.watch('./public/style.css',reload);
// });
