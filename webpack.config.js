const path = require('path')
const webpack = require('webpack')

const resolve = target => path.join(__dirname, target)

module.exports = {
  entry: {
    bundle: resolve('app/js/app.js')
  },

  output: {
    path: resolve('dist'),
    filename: '[name].js'
  },

  devtool: 'cheap-module-eval-source-map',

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
        test: /\.(glsl|md|obj)$/,
        loaders: [
          'raw-loader'
        ]
      },
      {
        test: /\.worker.js$/,
        loader: 'worker-loader?inline'
      }
    ]
  },

  devServer: {
    contentBase: __dirname,
    publicPath: '/',
    compress: true,
    port: 9000,
    hot: true,
    historyApiFallback: {
      index: 'app/index.dev.html'
    }
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.js',
      minChunks: module => {
        return module.context && module.context.indexOf('node_modules') !== -1
      }
    })
  ]
}
