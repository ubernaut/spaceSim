const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const resolve = target => path.join(__dirname, target)

module.exports = {
  entry: {
    bundle: resolve('app/js/app.js')
  },

  output: {
    path: resolve('dist'),
    filename: '[name]-[hash:16].js'
  },

  devtool: false,

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
      },
      {
        test: /\.worker.js$/,
        loader: 'worker-loader?inline'
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          'file-loader?hash=sha512&digest=hex&name=[hash].[ext]',
          'image-webpack-loader'
        ]
      }
    ]
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor-[hash:16].js',
      minChunks: module => {
        return module.context && module.context.indexOf('node_modules') !== -1
      }
    }),
    new HtmlWebpackPlugin({
      filename: '../index.html',
      template: resolve('app/index.prod.html')
    })
  ]
}
