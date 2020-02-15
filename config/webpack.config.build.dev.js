const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge');
const baseConf = require('./webpack.config.base');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const { buildDir } = require('./paths')
var ExtractTextPlugin = require('extract-text-webpack-plugin');

const webpack_build_dev = merge(baseConf, {
  output: {
    path: buildDir,
    filename: "[name].[hash].js",
  },

})

module.exports = webpack_build_dev;