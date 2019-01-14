const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const resolve = p => path.join(__dirname, p)

const isProd = process.env.NODE_ENV === 'production'

const devPlugins = [ new webpack.HotModuleReplacementPlugin() ]

module.exports = {
  mode: isProd ? ' production' : 'development',

  context: path.resolve(__dirname),

  entry: {
    bundle: resolve('app/js/app.js')
  },

  output: {
    path: resolve('dist'),
    filename: '[name].js',
    globalObject: 'this'
  },

  devtool: 'cheap-module-eval-source-map',

  resolve: {
    modules: [ 'node_modules' ],
    extensions: [ '*', '.json', '.js' ],
    alias: {
      '-': resolve('app/js'),
      app: resolve('app'),
      '@void': resolve('packages'),
      syncinput: resolve('app/lib/syncinput')
    }
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ],
        exclude: /node_modules/
      },
      {
        test: /\.(js|jsx)$/,
        loaders: [ 'babel-loader' ]
      },
      {
        test: /\.(glsl|md|obj)$/,
        loaders: [ 'raw-loader' ]
      },
      {
        test: /\.worker.js$/,
        loader: 'worker-loader?inline'
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          'file-loader?hash=sha512&digest=hex&name=[hash].[ext]',
          'image-webpack-loader?bypassOnDebug'
        ]
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'app/index.html'
    }),
    new CopyWebpackPlugin([
      { from: 'app/lib', to: 'app/lib' },
      { from: 'app/assets', to: 'app/assets' }
    ]),
    ...(isProd ? [] : devPlugins),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ],

  devServer: {
    host: '0.0.0.0',
    contentBase: __dirname,
    publicPath: '/',
    compress: true,
    port: 9000,
    hot: true,
    historyApiFallback: false
  }
}
