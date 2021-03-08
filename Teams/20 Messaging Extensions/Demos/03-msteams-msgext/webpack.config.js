// Copyright (c) Wictor Wilén. All rights reserved. 
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

const webpack = require("webpack");
const Dotenv = require("dotenv-webpack");
const nodeExternals = require("webpack-node-externals");
const ESLintPlugin = require("eslint-webpack-plugin");

const path = require("path");
const fs = require("fs");
const argv = require("yargs").argv;

const debug = argv.debug !== undefined;
const lint = !(argv["no-linting"] || argv.l === true);

const config = [{
    entry: {
        server: [
            path.join(__dirname, "/src/server/server.ts")
        ]
    },
    mode: debug ? "development" : "production",
    output: {
        path: path.join(__dirname, "/dist"),
        filename: "[name].js",
        devtoolModuleFilenameTemplate: debug ? "[absolute-resource-path]" : "[]"
    },
    externals: [nodeExternals()],
    devtool: debug ? "source-map" : "source-map",
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
        alias: {}
    },
    target: "node",
    node: {
        __dirname: false,
        __filename: false
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            exclude: /node_modules/,
            use: ["ts-loader"]
        }]
    },
    plugins: []
},
{
    entry: {
        client: [
            path.join(__dirname, "/src/client/client.ts")
        ]
    },
    mode: debug ? "development" : "production",
    output: {
        path: path.join(__dirname, "/dist/web/scripts"),
        filename: "[name].js",
        libraryTarget: "umd",
        library: "messagingExt",
        publicPath: "/scripts/"
    },
    externals: {},
    devtool: debug ? "source-map" : "source-map",
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
        alias: {}
    },
    target: "web",
    module: {
        rules: [{
            test: /\.tsx?$/,
            exclude: /node_modules/,
            use: ["ts-loader"]
        }]
    },
    plugins: [
        new Dotenv({
            systemvars: true
        })
    ]
}
];

if (lint !== false) {
    config[0].plugins.push(new ESLintPlugin({ extensions: ["ts", "tsx"], failOnError: false }));
    config[1].plugins.push(new ESLintPlugin({ extensions: ["ts", "tsx"], failOnError: false }));
}

module.exports = config;
