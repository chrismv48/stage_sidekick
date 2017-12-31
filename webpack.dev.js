const webpack = require('webpack')

const merge = require('webpack-merge')

const commonConfig = require('./webpack.common')

const devConfig = {
  entry: [
    'react-hot-loader/patch',
    'webpack-hot-middleware/client',
    './client/index.js'
  ],
  devtool: 'inline-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ]
}

module.exports = merge(commonConfig, devConfig)
