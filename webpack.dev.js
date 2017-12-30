const webpack = require('webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const merge = require('webpack-merge')

const commonConfig = require('./webpack.common')
const HotModuleReplacementPlugin = new webpack.HotModuleReplacementPlugin()

const devConfig = {
  entry: [
    'react-hot-loader/patch',
    'webpack-hot-middleware/client',
    './client/index.js'
  ],
  devtool: 'inline-source-map',
  plugins: [
    // HotModuleReplacementPlugin
    // new BundleAnalyzerPlugin()
  ]
}

module.exports = merge(commonConfig, devConfig)
