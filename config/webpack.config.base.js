const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const TsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

let alias = {
  js: path.join(__dirname, '../src/js'),
  models: path.join(__dirname, '../src/js/models'),
  components: path.join(__dirname, '../src/js/components'),
  containers: path.join(__dirname, '../src/js/containers'),
  hoc: path.join(__dirname, '../src/js/hoc'),
  observables: path.join(__dirname, '../src/js/observables'),
  routes: path.join(__dirname, '../src/js/routes'),
  utils: path.join(__dirname, '../src/js/utils'),
  mocks: path.join(__dirname, '../src/js/mocks'),
  css: path.join(__dirname, '../src/css'),
  services: path.join(__dirname, '../src/js/services'),
  config: path.join(__dirname, '../config'),
  assets: path.join(__dirname, '../src/assets'),
  legacy: path.join(__dirname, '../src/legacy')
}

module.exports = {
  output: {
    filename: 'assets/js/[name].[hash].js',
    chunkFilename: 'assets/js/[name].[hash].js',
    path: path.resolve(__dirname, '../build'),
    publicPath: '/'
  },
  resolve: {
    modules: [
      'node_modules'
    ],
    alias: alias,
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.scss', '.css', 'sass'],
    plugins: [
      new TsConfigPathsPlugin(),
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
      inject: true,
    }),
    new CopyWebpackPlugin([{
      from: 'src/assets',
      to: 'assets'
    }]),
    new CopyWebpackPlugin([
      { from: 'src/assets/locales/zh', to: 'assets/locales/zh-CN'},
    ]),
  ],
  module: {
    rules: [
      // JavaScript / ES6
      {
        test: /\.jsx?$/,
        include: path.resolve(__dirname, "../src/js"),
        loader: 'babel-loader'
      },
      // Images
      // Inline base64 URLs for <=8k images, direct URLs for the rest
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        loader: 'url-loader',
        query: {
          limit: 8192,
          name: 'images/[name].[ext]?[hash]'
        }
      },
      // Fonts
      {
        test: /\.(woff|woff2|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        query: {
          limit: 8192,
          name: 'fonts/[name].[ext]?[hash]'
        }
      },
      {
        type: 'javascript/auto',
        test: /\.json$/,
        use: [ { loader: 'raw-loader' } ],
      }
    ]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all"
        }
      }
    }
  }
}
