const path = require('path');
const webpack = require('webpack')

// Injects bundle into specified html file
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './client/index.html',
  filename: 'index.html',
  inject: 'body'
})

const ExtractTextPlugin = require('extract-text-webpack-plugin')
const ExtractTextPluginConfig = new ExtractTextPlugin('style.bundle.scss')
const HotModuleReplacementPlugin = new webpack.HotModuleReplacementPlugin()

module.exports = {

  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/assets/',
    filename: 'bundle.js'
  },

  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        use: [{
          loader: "style-loader"
        },
          {
            loader: "css-loader", options: {sourceMap: false}
          },
          {
            loader: "sass-loader", options: {sourceMap: false}
          }]
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|jpeg|jpg|png|gif)$/,
        loader: 'file-loader'
      }
    ],

  },
  plugins: [
    HtmlWebpackPluginConfig,
    ExtractTextPluginConfig,
    HotModuleReplacementPlugin
  ],

  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [
      path.resolve("./client"),
      path.resolve("./node_modules")
    ]
  },

};
