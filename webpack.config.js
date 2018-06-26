/* eslint-env node*/

const path = require('path');

module.exports = {
  mode: 'production',
  entry: './js/main.js',
  module: {
    rules:  [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  output: {
    filename: 'indexpage.js',
    path: path.resolve(__dirname, 'dist')
  },
};

