"use strict";

var gulp = require('gulp');
var gutil = require('gulp-util');
var connect = require('gulp-connect'); //Runs a local dev server
var open = require('gulp-open'); //Open a URL in a web browser
var clean = require('gulp-clean'); // cleans build folder
var browserify = require('browserify'); // Bundles JS
var reactify = require('reactify');  // Transforms React JSX to JS
var source = require('vinyl-source-stream'); // Use conventional text streams with Gulp
var concat = require('gulp-concat'); //Concatenates files
var lint = require('gulp-eslint'); //Lint JS files, including JSX
var inject = require('gulp-inject'); // inject references to html page
var less = require('gulp-less');

var handleErrors = require('../util/handleErrors');
var bundleLogger = require('../util/bundleLogger');

var config = require('../conflig');

var isDebugMode = gutil.env.type !== 'prod';

//Start a local development server
gulp.task('connect', function() {
    connect.server({
        root: [config.paths.dist],
        port: config.port,
        base: config.devBaseUrl,
        livereload: true
    });
});

gulp.task('open', ['connect'], function() {
    gulp.src(config.paths.html)
        .pipe(open({ uri: config.devBaseUrl + ':' + config.port + '/'}));
});

gulp.task('html', function() {
    bundleLogger.start('html');
    var task = gulp.src(config.paths.html)
        .pipe(gulp.dest(config.paths.dist))
        .on('error', handleErrors)
        .pipe(connect.reload())
        .on('error', handleErrors);

    task.on('end', function () {
        bundleLogger.end('html');
    });
});

gulp.task('js', function() {
    bundleLogger.start('js browserifying');
    gulp.src(config.paths.libs)
        .pipe(gulp.dest(config.paths.dist + '/lib'));
    var task = browserify(config.paths.mainJs, {transform: reactify, debug: isDebugMode})
        .bundle()
        .on('error', handleErrors)
        .pipe(source('bundle.js'))
        .on('error', handleErrors)
        .pipe(gulp.dest(config.paths.dist + '/scripts'))
        .on('error', handleErrors)
        .pipe(connect.reload())
        .on('error', handleErrors);

    task.on('end', function () {

        var target = gulp.src(config.paths.dist + '/index.html');

        // It's not necessary to read the files (will speed up things), we're only after their paths:
        var sources = gulp.src([ './dist/**/*.js', './dist/**/*.css'], {read: false});

        target.pipe(inject(sources, {relative: true}))
            .pipe(gulp.dest('./dist'));

        bundleLogger.end('js browserifying');
    });
});

gulp.task('css', function() {

    console.log(gutil.env);

    gulp.src(config.paths.css)
        .pipe(isDebugMode ? gutil.noop() : concat('bundle.css'))
        .on('error', handleErrors)
        .pipe(gulp.dest(config.paths.dist + '/assets/css'))
        .on('error', handleErrors);
});

gulp.task('less', function () {
    return gulp.src(config.paths.less)
        .pipe(less())
        .pipe(gulp.dest(config.paths.dist + '/assets/css'));
});

// Migrates images to dist folder
// Note that I could even optimize my images here
gulp.task('images', function () {
    gulp.src(config.paths.images)
        .pipe(gulp.dest(config.paths.dist + '/images'))
        .on('error', handleErrors)
        .pipe(connect.reload())
        .on('error', handleErrors);

    //publish favicon
    gulp.src('./src/favicon.ico')
        .pipe(gulp.dest(config.paths.dist))
        .on('error', handleErrors);
});

gulp.task('lint', function() {
    return gulp.src(config.paths.js)
        .pipe(lint({config: 'eslint.config.json'}))
        .on('error', handleErrors)
        .pipe(lint.format())
        .on('error', handleErrors);
});

gulp.task('clean', function () {
    return gulp.src(config.paths.dist, {read: false})
        .pipe(clean());
});

gulp.task('watch', function() {
    gulp.watch(config.paths.html, ['html']);
    gulp.watch(config.paths.js, ['js', 'lint']);
});

gulp.task('build', ['html', 'js', 'less', 'css', 'images']);

gulp.task('default', ['build', 'open', 'watch']);