'use strict';

const Path = require('path');
const Webpack = require('webpack');

module.exports = {
  entry: {
   serpentity: './lib/serpentity.js',
   "serpentity.min": './lib/serpentity.js',
  },

  output: {
    path: Path.resolve(__dirname, '../dist'),
    filename: '[name].js',
    library: 'Serpentity',
    libraryTarget: 'umd'
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|doc)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }
    ]
  },

  resolve: {
    modules: [
      'node_modules',
      Path.resolve(__dirname, '../lib')
    ],

    extensions: ['.js'],
  },

  context: Path.resolve(__dirname, '..'),

  plugins : [
    new Webpack.optimize.UglifyJsPlugin({
      include: /\.min\.js$/,
      minimize: true
    })
  ]
};

