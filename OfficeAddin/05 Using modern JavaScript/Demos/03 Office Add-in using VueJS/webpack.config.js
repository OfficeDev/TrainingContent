// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require("webpack");
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
    devtool: 'source-map',
    entry: {
        app: './src/index.ts',
        'function-file': './function-file/function-file.ts'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.html', '.js', '.vue'],
        alias: {
            vue$: 'vue/dist/vue.js'
        }
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [{
                  loader: 'ts-loader',
                  options: {
                    appendTsSuffixTo: [/\.vue$/],
                    transpileOnly: true
                  }
                }]
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: { esModule: true }
            },
            {
                test: /\.html$/,
                exclude: /node_modules/,
                use: 'html-loader'
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/,
                use: 'file-loader'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
            chunks: ['app']
        }),
        new HtmlWebpackPlugin({
            template: './function-file/function-file.html',
            filename: 'function-file/function-file.html',
            chunks: ['function-file']
        }),
        new webpack.ProvidePlugin({
            Promise: ["es6-promise", "Promise"]
        }),
        new VueLoaderPlugin()
    ]
};