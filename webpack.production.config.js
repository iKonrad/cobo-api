const path = require('path');
const webpack = require('webpack');
const webpackNodeExternals = require('webpack-node-externals');
const PATHS = require('./settings/paths.js');

const serverConfig = {
  // Inform webpack that we're building a bundle
  // for Node JS rather than for the browser
  target: 'node',
  node: {
    __dirname: false,
    __filename: false,
  },

  resolve: {
    alias: PATHS,
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },

  // Tell webpack if we're on development or production environment
  mode: 'production',

  // Tell webpack the root file of our server application
  entry: './src/index.ts',

  // Tell webpack where to put the output file that is generated
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build'),
  },

  // Tell webpack to run babel on every file it runs through
  module: {
    rules: [
      { test: /\.tsx?$/, use: [{ loader: 'awesome-typescript-loader' }] },
      {
        test: /\.js?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          babelrc: false,
          presets: [
            ['env',
              {
                modules: false,
                targets: { browsers: ['last 2 versions'] },
              },
            ],
            'react',
            'stage-0',
          ],
          plugins: [
            'transform-decorators-legacy',
            'transform-class-properties',
            'syntax-class-properties',
          ],
        },
      },
    ],
  },

  externals: [
    webpackNodeExternals(),
  ],
};

module.exports = serverConfig;
