
var webpack = require('webpack');

var path = require('path');
var fs = require('fs');

var nodeModules = {};
fs.readdirSync('node_modules')
    .filter(function (x) {
        return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function (mod) {
        nodeModules[mod] = 'commonjs ' + mod;
    });

var config = [
    {
        entry: {
            server: [
                __dirname + '/src/app/server.ts'
            ],
        },
        output: {
            path: __dirname + '/dist',
            filename: '[name].js'
        },
        externals: nodeModules,
        devtool: 'source-map',
        resolve: {
            extensions: [".ts", ".tsx", ".js"],
            alias: {
            }
        },
        target: 'node',
        node: {
            __dirname: false,
            __filename: false,
        },
        module: {
            loaders: [
                {
                    test: /\.tsx?$/,
                    exclude: [/lib/, /dist/],
                    loader: "ts-loader"
                }
            ]
        },
        plugins: [
        ]
    },
    {
        entry: {
            client: [
                __dirname + '/src/app/scripts/client.ts'
            ]
        },
        output: {
            path: __dirname + '/dist/web/scripts',
            filename: '[name].js',
            libraryTarget: 'umd',
            library: 'teamsApp1'
        },
        externals: {
        },
        devtool: 'source-map',
        resolve: {
            extensions: [".ts", ".tsx", ".js"],
            alias: {
            }
        },
        target: 'web',
        module: {
            loaders: [
                {
                    test: /\.tsx?$/,
                    exclude: [/lib/, /dist/],
                    loader: "ts-loader",
                    options: {
                        configFileName: "tsconfig-client.json"                        
                    }
                }
            ]
        },
        plugins: [
        ]
    }
];

module.exports = config;