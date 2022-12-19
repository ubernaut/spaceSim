const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin
const TerserPlugin = require('terser-webpack-plugin')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')

const resolve = p => path.join(__dirname, p)

const isProd = process.env.NODE_ENV === 'production'

const plugins = [
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: 'app/index.html'
  }),
  new CopyWebpackPlugin({
    patterns: [
      { from: 'app/lib', to: 'app/lib' },
      { from: 'app/assets', to: 'app/assets' }
  ]}),
  new webpack.ProvidePlugin({
    THREE: 'three',
    process: 'process/browser'
  }),
  new webpack.DefinePlugin({
    "process.env.API_HOST": JSON.stringify(process.env.API_HOST),
    "process.env.API_PORT": JSON.stringify(process.env.API_PORT)
  }),
  ...[!isProd && new ReactRefreshWebpackPlugin()].filter(Boolean),
]

if (process.env.ANALYZE === 'true') {
  plugins.push(new BundleAnalyzerPlugin())
}

module.exports = {
  mode: isProd ? 'production' : 'development',

  context: path.resolve(__dirname),

  entry: {
    app: resolve('app/js/app.js')
  },

  output: {
    path: resolve('dist'),
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[chunkhash].js',
    globalObject: 'this'
  },

  resolve: {
    modules: [ 'node_modules' ],
    extensions: [ '.mjs', '.js', '.jsx', '.json' ],
    alias: {
      '-': resolve('app/js'),
      app: resolve('app'),
      '@void': resolve('packages'),
      syncinput: resolve('app/lib/syncinput'),
      'three/OBJLoader': path.join(
        __dirname,
        'node_modules/three/examples/js/loaders/OBJLoader.js'
      )
    }
  },

  optimization: {
    emitOnErrors: false,
    minimize: false,
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /node_modules/,
          name: 'common',
          chunks: 'all'
        }
      }
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
        exclude: /node_modules/,
        use: [
          {
            loader: require.resolve('babel-loader'),
            options: {
              plugins: [!isProd && require.resolve('react-refresh/babel')].filter(Boolean)
            }
          }
        ]
      },
      {
        test: /\.(glsl|md|obj)$/,
        use: [ 'raw-loader' ]
      },
      {
        test: /\.worker.js$/,
        loader: 'worker-loader',
        options: {
          filename: '[name].[fullhash].js'
        }
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[hash].[ext]'
            }
          },
          'image-webpack-loader'
        ]
      }
    ]
  },

  plugins,

  devServer: {
    host: '0.0.0.0',
    compress: true,
    port: 9000,
    hot: true,
    historyApiFallback: false
  }
}
