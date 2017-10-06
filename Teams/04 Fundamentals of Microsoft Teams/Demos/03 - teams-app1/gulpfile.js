'use strict'
var gulp = require('gulp');
var webpack = require('webpack');
var gutil = require('gulp-util');
var inject = require('gulp-inject');
var runSequence = require('run-sequence');
const zip = require('gulp-zip');
var nodemon = require('nodemon');

var injectSources = ["./dist/web/scripts/**/*.js"]
var typeScriptFiles = ["./src/**/*.ts"]
var staticFiles = ["./src/app/**/*.html", "./src/app/web/assets/**/*"]
var htmlFiles = ["./src/app/**/*.html"]
var watcherfiles = ["./src/**/*.*"]
var manifestFiles = ["./src/manifest/**/*.*"]


/**
 * Watches source files and invokes the build task
 */
gulp.task('watch', function () {
    gulp.watch('./src/**/*.*', ['build']);
});


/**
 * Creates the tab manifest
 */
gulp.task('manifest', () => {
    gulp.src(manifestFiles)
        .pipe(zip('teams-app-1.zip'))
        .pipe(gulp.dest('package'))
});

/**
 * Webpack bundling
 */
gulp.task('webpack', function (callback) {
    var webpackConfig = require(process.cwd() + '/webpack.config')
    webpack(webpackConfig
        , function (err, stats) {
            if (err) throw new gutil.PluginError("webpack", err);

            var jsonStats = stats.toJson();
            if (jsonStats.errors.length > 0) {
                var errs =
                    jsonStats.errors.map(function (e) {
                        gutil.log('[Webpack error] ' + e)
                    });
                throw new gutil.PluginError("webpack", "Webpack errors, see log");
            }
            if (jsonStats.warnings.length > 0) {
                var errs =
                    jsonStats.warnings.map(function (e) {
                        gutil.log('[Webpack warning] ' + e)
                    });

            }
            gutil.log("[Webpack]\n", stats.toString('minimal'));
            callback();
        });
});

/**
 * Copies static files
 */
gulp.task('static:copy', function () {
    return gulp.src(staticFiles, { base: "./src/app" })
        .pipe(gulp.dest('./dist/'));
})

/**
 * Injects script into pages
 */
gulp.task('static:inject', ['static:copy'], function () {

    var injectSrc = gulp.src(injectSources);

    var injectOptions = {
        relative: false,
        ignorePath: 'dist/web',
        addRootSlash: false
    };

    return gulp.src(htmlFiles)
        .pipe(inject(injectSrc, injectOptions)) // inserts custom sources
        .pipe(gulp.dest('./dist'));
});

/**
 * Build task, that uses webpack and injects scripts into pages
 */
gulp.task('build', function () {
    runSequence('webpack', 'static:inject')
});

/**
 * Task for local debugging
 */
gulp.task('serve', ['build', 'watch'], function (cb) {
    var started = false;
    return nodemon({
        script: 'dist/server.js',
        watch: ['dist/server.js']
    }).on('start', function () {
        if (!started) {
            cb();
            started = true;
        }
    });
});
