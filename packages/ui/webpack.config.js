const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const resolve = p => path.join(__dirname, p)

module.exports = {
  mode: 'development',

  context: path.resolve(__dirname),

  entry: {
    app: [ resolve('src/app.js') ]
  },

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, `./dist`),
    publicPath: '/'
  },

  devtool: 'cheap-module-eval-source-map',

  resolve: {
    modules: [ 'node_modules' ],
    extensions: [ '*', '.json', '.js' ],
    alias: {
      components: resolve('lib/components')
    }
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: [ resolve('lib'), resolve('src') ],
        loaders: [ 'babel-loader' ]
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.scss$/,
        use: [ 'style-loader', 'css-loader', 'sass-loader' ]
      }
    ]
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html'
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ],

  devServer: {
    publicPath: '/',
    compress: true,
    port: 9001,
    hot: true,
    historyApiFallback: false
  }
}
