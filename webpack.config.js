const path = require('path');
const pkg = require('./package.json');

const config = {
  entry: __dirname + '/src/index.js',
  devtool: 'source-map',
  mode: 'production',
  output: {
    path: __dirname + '/lib',
    filename: 'livetiming-analysis.js',
    library: pkg.name,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel-loader',
        exclude: /(node_modules)/
      },
      {
        test: /(\.jsx|\.js)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    modules: [path.resolve('./node_modules'), path.resolve('./src')],
    extensions: ['.json', '.js']
  }
};

module.exports = config;
