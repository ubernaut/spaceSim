const path = require('path')
const webpack = require('webpack')

const resolve = target => path.join(__dirname, target)

module.exports = {
  entry: resolve('app/js/app.js'),

  output: {
    path: resolve('dist'),
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
      '-': resolve('app/js'),
      'app': resolve('app')
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

  devServer: {
    contentBase: __dirname,
    publicPath: '/dist/',
    compress: true,
    port: 8000,
    hot: true
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
}
