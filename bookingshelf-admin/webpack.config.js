const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const externals = require('./externals');

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: './src/index.jsx',
  output: {
    path: path.resolve('dist'),
    filename: 'app-[hash].js',
    publicPath: process.env.CONTEXT,
  },
  resolve: {
    extensions: ['.js', '.json', '.jsx'],
  },
  module: {
    rules: [
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url-loader',
        query: {
          name: '[name].[ext]?[hash]',
        },
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: require.resolve('style-loader'),
          },
          {
            loader: require.resolve('css-loader'),
          },
          {
            loader: require.resolve('sass-loader'),
          },
          {
            loader: require.resolve('postcss-loader'),
            options: {
              ident: 'postcss-scss',
              syntax: 'postcss-scss',
              sourceMap: true,
              plugins: [
                autoprefixer(),
              ],
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      inject: 'body',
      vendorsFilename: process.env.CONTEXT,
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        CONTEXT: JSON.stringify(process.env.CONTEXT),
      },
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.IgnorePlugin(/^\.\/auth$/, /firebase$/),
    new webpack.IgnorePlugin(/^\.\/storage$/, /firebase$/),
    new webpack.IgnorePlugin(/^\.\/messaging$/, /firebase$/),

    new CompressionPlugin({
      filename: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.js$|\.css$|\.scss$|\.html$|\.eot?.+$|\.ttf?.+$|\.woff?.+$|\.svg?.+$/,
    }),
  ],
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        test: /\.js(\?.*)?$/i,
        cache: true,
        parallel: true,
        sourceMap: true,
        extractComments: 'all',
        uglifyOptions: {
          warnings: false,
          parse: {},
          compress: {},
          mangle: true, // Note `mangle.properties` is `false` by default.
          output: null,
          toplevel: false,
          nameCache: null,
          ie8: false,
          keep_fnames: false,
        },
      }),
    ],
  },
  devServer: {
    historyApiFallback: { index: process.env.CONTEXT },
    host: 'localhost',
    port: 8081,
    contentBase: './',
  },
  externals,
};
