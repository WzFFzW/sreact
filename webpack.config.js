const path = require('path');
/* eslint-disable import/no-extraneous-dependencies */
const HtmlWebpackPlugin = require('html-webpack-plugin');

const rootDir = process.cwd();
const srcDir = path.resolve(rootDir, 'src');

module.exports = {
  mode: 'development',
  entry: ['./src/index.jsx'],
  output: {
    filename: '[name].js',
    path: path.resolve(rootDir, 'public'),
  },
  resolve: {
    extensions: ['.js', '.jsx', 'json'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [
          'babel-loader',
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(srcDir, 'index.html'),
    }),
  ],
};
