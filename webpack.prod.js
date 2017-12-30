const webpack = require('webpack')
const merge = require('webpack-merge')
const CompressionPlugin = require('compression-webpack-plugin');
const commonConfig = require('./webpack.common')
const compressionConfig = new CompressionPlugin({
  asset: "[path].gz[query]",
  algorithm: "gzip",
  test: /\.js$|\.css$|\.scss$|\.html$/,
  threshold: 10240,
  minRatio: 0.8
})

// NOTE: we don't need uglify because webpack2 runs minification in production mode by default
prodConfig = {
  entry: './client/index.js',
  devtool: 'cheap-module-source-map',
  plugins: [
    new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
     }),
    compressionConfig
  ]
}
 module.exports = merge(commonConfig, prodConfig)
