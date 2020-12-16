// Copyright (c) Wictor Wilén. All rights reserved. 
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

// Load general config
const config = require('./gulp.config');

const package = require("./package.json");

// NodeJS
const fs = require('fs'),
    path = require('path');

// Gulp Base
const {
    src,
    dest,
    watch,
    series,
    parallel,
    lastRun,
    task
} = require('gulp');

// gulp plugins
const inject = require('gulp-inject'),
    zip = require('gulp-zip'),
    replace = require('gulp-token-replace'),
    PluginError = require('plugin-error'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    del = require('del');

const $ = gulpLoadPlugins();

// Web Servers
const ngrok = require('ngrok');

// load references
const
    nodemon = require('nodemon'),
    argv = require('yargs').argv,
    autoprefixer = require('autoprefixer'),
    log = require('fancy-log'),
    ZSchema = require('z-schema'),
    axios = require('axios');

const webpack = require('webpack');

const env = argv["env"];
if (env === undefined) {
    require('dotenv').config();
} else {
    log(`Using custom .env`);
    require('dotenv').config({ path: path.resolve(process.cwd(), env) });
}
process.env.VERSION = package.version;

/**
 * Setting up environments
 */
const isProd = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';
const isDev = !isProd && !isTest;

const styles = () => {
    return src('src/app/**/*.scss')
        .pipe($.plumber())
        .pipe($.if(!isProd, $.sourcemaps.init()))
        .pipe($.sass.sync({
            outputStyle: 'expanded',
            precision: 10,
            includePaths: ['.']
        }).on('error', $.sass.logError))
        .pipe($.postcss([
            autoprefixer()
        ]))
        .pipe($.if(!isProd, $.sourcemaps.write()))
        .pipe(dest('dist'));
};

/**
 * Register watches
 */
const watches = () => {

    // all other watches
    watch(
        config.watches,
        series('webpack:server')
    );

    watch(
        config.clientWatches,
        series('webpack:client')
    );

    // watch for style changes
    watch('src/app/**/*.scss', series('styles', 'static:copy', 'static:inject'))
        .on('unlink', (a, b) => {

            let cssFilename = path.basename(a, '.scss') + '.css',
                cssDirectory = path.dirname(a).replace('src/app', './dist'),
                cssPath = path.join(cssDirectory, cssFilename);

            console.log(cssPath, fs.existsSync(cssPath));

            if (fs.existsSync(cssPath)) {

                fs.unlinkSync(cssPath);
                injectSources();

            }

        });

    // watch on new and deleted files
    watch(config.injectSources)
        .on('unlink', injectSources)
        .on('add', injectSources);


    // watch for static files
    watch(config.staticFiles, series('static:copy', 'static:inject'));
}

task('watch', watches);

// TASK: nuke
task('nuke', () => {
    return del(['temp', 'dist']);
});

task('nodemon', (callback) => {
    var started = false;
    var debug = argv.debug !== undefined;

    return nodemon({
        script: 'dist/server.js',
        watch: ['dist/server.js'],
        nodeArgs: debug ? ['--inspect'] : []
    }).on('start', function () {
        if (!started) {
            callback();
            started = true;
            log('HOSTNAME: ' + process.env.HOSTNAME);
        }
    });
});


const _webpack = (idx, callback) => {
    const webpackConfig = require(
        path.join(__dirname + '/webpack.config')
    )

    webpack(webpackConfig[idx], (err, stats) => {

        if (err) throw new PluginError("webpack", err);

        var jsonStats = stats.toJson();

        if (jsonStats.errors.length > 0) {

            jsonStats.errors.map(e => {
                log('[Webpack error] ' + e.message);
            });
        }
        if (jsonStats.warnings.length > 0) {
            jsonStats.warnings.map(function (e) {
                log('[Webpack warning] ' + e.message);
            });
        }
        callback();
    });
}

/**
 * Webpack bundling
 */
task('webpack:client', (callback) => {
    _webpack(1, callback);
});

task('webpack:server', (callback) => {
    _webpack(0, callback);
});

task('webpack', parallel("webpack:client", "webpack:server"));


/**
 * Copies static files
 */
task('static:copy', () => {
    return src(config.staticFiles, {
        base: "./src/app"
    })
        .pipe(
            dest('./dist/')
        );
});

const injectSources = () => {

    var injectSrc = src(config.injectSources);

    var injectOptions = {
        relative: false,
        ignorePath: 'dist/web',
        addRootSlash: true
    };
    return src(config.htmlFiles)
        .pipe(replace({
            tokens: {
                ...process.env
            }
        }))
        .pipe(
            inject(injectSrc, injectOptions)
        )
        .pipe(
            dest('./dist')
        );

};

/**
 * Injects script into pages
 */
task('static:inject', injectSources);

/**
 * SASS compilation
 */
task('styles', styles);

/**
 * Build task, that uses webpack and injects scripts into pages
 */
task('build', series('webpack', 'styles', 'static:copy', 'static:inject'));

/**
 * Replace parameters in the manifest
 */
task('generate-manifest', (cb) => {
    return src('src/manifest/manifest.json')
        .pipe(replace({
            tokens: {
                ...process.env
            }
        }))
        .pipe(dest(config.temp));
});

/**
 * Schema validation
 */
task('schema-validation', (callback) => {

    let filePath = path.join(__dirname, 'temp/manifest.json');

    if (fs.existsSync(filePath)) {

        let manifest = fs.readFileSync(filePath, {
            encoding: 'UTF-8'
        }),
            manifestJson;

        try {

            manifestJson = JSON.parse(manifest);

        } catch (error) {

            callback(
                new PluginError(error.message)
            );
            return;

        }

        log('Using manifest schema ' + manifestJson.manifestVersion);

        let definition = config.SCHEMAS.find(s => s.version == manifestJson.manifestVersion);

        if (definition === undefined) {
            callback(new PluginError("validate-manifest", "Unable to locate schema"));
            return;
        }

        if (manifestJson["$schema"] !== definition.schema) {
            log("Note: the defined schema in your manifest does not correspond to the manifestVersion");
        }

        let requiredUrl = definition.schema;
        let validator = new ZSchema();

        let schema = {
            "$ref": requiredUrl
        };

        axios.get(requiredUrl, {
            decompress: true,
            responseType: 'json'
        }).then(response => {
            validator.setRemoteReference(requiredUrl, response.data);

            var valid = validator.validate(manifestJson, schema);
            var errors = validator.getLastErrors();
            if (!valid) {
                callback(new PluginError("validate-manifest", errors.map((e) => {
                    return e.message;
                }).join('\n')));
            } else {
                callback();
            }
        }).catch(err => {
            log.warn("WARNING: unable to download and validate schema: " + err);
            callback();
        });

    } else {
        console.log('Manifest doesn\'t exist');
    }

});

task('validate-manifest', series('generate-manifest', 'schema-validation'));

/**
 * Task for starting ngrok and replacing the HOSTNAME with ngrok tunnel url.
 * The task also creates a manifest file with ngrok tunnel url.
 * See local .env file for configuration
 */
task('start-ngrok', (cb) => {
    log("[NGROK] starting ngrok...");
    let conf = {
        subdomain: process.env.NGROK_SUBDOMAIN,
        region: process.env.NGROK_REGION,
        addr: process.env.PORT,
        authtoken: process.env.NGROK_AUTH
    };


    ngrok.connect(conf).then((url) => {
        log('[NGROK] Url: ' + url);
        if (!conf.authtoken) {
            log("[NGROK] You have been assigned a random ngrok URL that will only be available for this session. You wil need to re-upload the Teams manifest next time you run this command.");
        }
        let hostName = url.replace('http://', '');
        hostName = hostName.replace('https://', '');

        log('[NGROK] HOSTNAME: ' + hostName);
        process.env.HOSTNAME = hostName

        cb();

    }).catch((err) => {
        log.error(`[NGROK] Error: ${JSON.stringify(err)}`);
        cb(err.msg);
    });
});

/**
 * Creates the tab manifest
 */
task('zip', () => {
    return src(config.manifests)
        .pipe(src('./temp/manifest.json'))
        .pipe(zip(config.manifestFileName))
        .pipe(dest('package'));
});

task('styles', styles);

task('serve', series('nuke', 'build', 'nodemon', 'watch'));

task('manifest', series('validate-manifest', 'zip'));

task('ngrok-serve', series('start-ngrok', 'manifest', 'serve'));