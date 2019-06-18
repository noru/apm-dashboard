const merge = require('webpack-merge')
const webpack = require('webpack')
const config = require('./webpack.config.base')
const path = require('path')

const GLOBALS = {
  'process.env': {
    'NODE_ENV': JSON.stringify('development')
  },
  __USE_MOCK__: JSON.stringify(JSON.parse(process.env.USE_MOCK || 'false')),
}

module.exports = merge(config, {
  mode: 'development',
  cache: true,
  devtool: 'cheap-module-eval-source-map',
  entry: {
    app: [
      'react-hot-loader/patch',
      'webpack/hot/only-dev-server',
      path.join(__dirname, '../src/js/index')
    ],
    vendor: ['react', 'react-dom', 'react-router'],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin(GLOBALS)
  ],
  module: {
    rules: [
      // Typescript
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader',
        options: {
          configFileName: 'tsconfig.dev.json',
        }
      },
      // Sass
      {
        test: /\.s?css$/,
        loaders: [
          'style-loader',
          'css-loader',
          { loader: 'sass-loader', query: { outputStyle: 'expanded' } },
          'postcss-loader'
        ]
      }
    ]
  },
  devServer: {
    noInfo: true,
    overlay: true,
    hot: true,
    publicPath: config.output.publicPath,
    stats: {
      colors: true
    },
    contentBase: path.join(__dirname, "../src"),
    watchContentBase: true,
    historyApiFallback: true,
    port: 8888,
    proxy: {
      '/gateway': {
        target: 'http://apm-dev.hcdigital.com.cn:8090',
        pathRewrite: {
          '^/gateway': '',
        },
        changeOrigin: true,
      },
    },
    disableHostCheck: true,
  }
})
