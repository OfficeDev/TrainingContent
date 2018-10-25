// Copyright (c) Wictor Wilén. All rights reserved. 
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

var gulp = require('gulp');
var webpack = require('webpack');
var inject = require('gulp-inject');
const zip = require('gulp-zip');
var nodemon = require('nodemon');
var argv = require('yargs').argv;
var PluginError = require('plugin-error');
var log = require('fancy-log');
var fs = require('fs');
var ZSchema = require('z-schema');
var request = require('request');
var path = require('path');

var injectSources = ["./dist/web/scripts/**/*.js", './dist/web/assets/**/*.css']
var staticFiles = ["./src/app/**/*.html", "./src/app/**/*.ejs", "./src/app/web/assets/**/*"]
var htmlFiles = ["./src/app/**/*.html", "./src/app/**/*.ejs"]
var watcherfiles = ["./src/**/*.*"]
var manifestFiles = ["./src/manifest/**/*.*"]


/**
 * Watches source files and invokes the build task
 */
gulp.task('watch', () => {
    gulp.watch(watcherfiles, gulp.series('build'));
});


/**
 * Webpack bundling
 */
gulp.task('webpack', (callback) => {
    var webpackConfig = require(process.cwd() + '/webpack.config')
    webpack(webpackConfig, function (err, stats) {
        if (err) throw new PluginError("webpack", err);

        var jsonStats = stats.toJson();
        if (jsonStats.errors.length > 0) {
            jsonStats.errors.map(function (e) {
                log('[Webpack error] ' + e);
            });
            throw new PluginError("webpack", "Webpack errors, see log");
        }
        if (jsonStats.warnings.length > 0) {
            jsonStats.warnings.map(function (e) {
                log('[Webpack warning] ' + e);
            });
        }
        callback();
    });
});

/**
 * Copies static files
 */
gulp.task('static:copy', () => {
    return gulp.src(staticFiles, {
            base: "./src/app"
        })
        .pipe(gulp.dest('./dist/'));
});

/**
 * Injects script into pages
 */
gulp.task('static:inject', () => {
    var injectSrc = gulp.src(injectSources);

    var injectOptions = {
        relative: false,
        ignorePath: 'dist/web',
        addRootSlash: true
    };

    return gulp.src(htmlFiles)
        .pipe(inject(injectSrc, injectOptions)) // inserts custom sources
        .pipe(gulp.dest('./dist'));
});

/**
 * Build task, that uses webpack and injects scripts into pages
 */
gulp.task('build', gulp.series('webpack', 'static:copy', 'static:inject'));

/**
 * Schema validation
 */
gulp.task('validate-manifest', (callback) => {

    var filePath = path.join(__dirname, 'src/manifest/manifest.json');
    fs.readFile(filePath, {
        encoding: 'utf-8'
    }, function (err, data) {
        if (!err) {
            var requiredUrl = "https://statics.teams.microsoft.com/sdk/v1.2/manifest/MicrosoftTeams.schema.json";
            var validator = new ZSchema();
            var json = JSON.parse(data);
            var schema = {
                "$ref": requiredUrl
            };
            request(requiredUrl, {
                gzip: true
            }, (err, res, body) => {
                validator.setRemoteReference(requiredUrl, JSON.parse(body));

                var valid = validator.validate(json, schema);
                var errors = validator.getLastErrors();
                if (!valid) {
                    callback(new PluginError("validate-manifest", errors.map((e) => {
                        return e.message;
                    }).join('\n')));
                } else {
                    callback();
                }
            })

        } else {
            callback(PluginError("validate-manifest", err));
        }
    });
});

/**
 * Task for local debugging
 */
gulp.task('nodemon', (cb) => {
    var started = false;
    var debug = argv.debug !== undefined;

    return nodemon({
        script: 'dist/server.js',
        watch: ['dist/server.js'],
        nodeArgs: debug ? ['--debug'] : []
    }).on('start', function () {
        if (!started) {
            cb();
            started = true;
        }
    });
});

gulp.task('serve', gulp.series('build', 'nodemon', 'watch'));

/**
 * Creates the tab manifest
 */
gulp.task('zip', () => {
    return gulp.src(manifestFiles)
        .pipe(zip('teams-app-1.zip'))
        .pipe(gulp.dest('package'));
});

gulp.task('manifest', gulp.series('validate-manifest', 'zip'));