const path = require('path');

module.exports = [
  'source-map'
].map(devtool => ({
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'livetiming-analysis.js',
    library: 'livetiming-analysis',
    libraryTarget: 'umd'
  },
  devtool,
  optimization: {
    runtimeChunk: true
  }
}));
