const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: './js/app.js',

  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  },

  devtool: 'eval-source-map',

  resolve: {
    modules: [ 'node_modules' ],
    extensions: [
      '*',
      '.json',
      '.js'
    ],
    alias: {
      '-': path.join(__dirname, 'js')
    }
  },

  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: 'style!css'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: [
          'babel-loader'
        ]
      },
      {
        test: /\.(glsl|md|obj)$/i,
        loaders: [
          'raw-loader'
        ]
      }
    ]
  },

  plugins: [
    new webpack.optimize.UglifyJsPlugin()
  ]
}
