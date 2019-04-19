const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const ENV = process.env.NODE_ENV = process.env.ENV = 'production';

module.exports = webpackMerge(commonConfig, {
    devtool: 'source-map',

    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM'
    },

    performance: {
        hints: "warning"
    },

    optimization: {
        minimize: true
      }
});

