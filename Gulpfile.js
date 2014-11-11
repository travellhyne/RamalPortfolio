var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    browserify = require('gulp-browserify'),
    preprocess = require('gulp-preprocess'),
    stylus = require('gulp-stylus'),
    del = require('del'),
    nib = require('nib'),
    util = require('gulp-util'),
	connect = require('gulp-connect'),
	watch = require('gulp-watch');

var pkg = require('./package.json');

gulp.task('jshint', function () {
    return gulp.src('src/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('clean', function (cb) {
    return del(['dist/*'], cb);
});

gulp.task('stylus:compile', function () {
    return gulp.src('src/stylus/*.styl')
        .pipe(stylus({ use: nib() }))
        .pipe(concat(pkg.name+'.css'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('build:html', function () {
    return gulp.src('src/index.html')
        .pipe(preprocess({ context: pkg }))
        .pipe(gulp.dest('./dist'));
});

gulp.task('build:scripts', function () {
    return gulp.src('src/app/app.js')
        .pipe(browserify())
        .pipe(concat(pkg.name+'.js'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('copy:assets', function () {
	return gulp.src('src/assets/*.jpg')
		.pipe(gulp.dest('./dist/images'));
});

gulp.task('watch', function () {
	gulp.watch('src/index.html', ['build:html']);
	gulp.watch('src/**/*.js', ['build:scripts']);
	gulp.watch('src/stylus/*.styl', ['stylus:compile']);
});

gulp.task('server', function () {
	connect.server({
		livereload: true,
		root: ['./dist']
	});
});

gulp.task('livereload', function () {
	gulp.src(['./dist/*.html', './dist/*.js', './dist/*.css'])
		.pipe(watch(['./dist/*.html', './dist/*.js', './dist/*.css']))
		.pipe(connect.reload());
});

gulp.task('build', ['clean', 'stylus:compile', 'build:html', 'build:scripts', 'copy:assets']);

gulp.task('default', ['jshint', 'build']);

gulp.task('serve', ['copy:assets', 'stylus:compile', 'build:html', 'build:scripts', 'watch', 'livereload', 'server']);