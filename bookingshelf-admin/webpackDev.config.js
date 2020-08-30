const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const CompressionPlugin = require('compression-webpack-plugin');

const externals = require('./externals');

module.exports = {
    devtool: 'cheap-module-source-map',
    entry: ['webpack-dev-server/client', 'webpack/hot/dev-server', './src/index.jsx'],
    output: {
        path: path.resolve('dist'),
        filename: 'app-[hash].js',
        publicPath: process.env.CONTEXT
    },
    resolve: {
        extensions: ['.js', '.json', '.jsx']
    },
    module: {
        rules: [
            { test: /\.css$/, loader: "style-loader!css-loader" },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'url-loader',
                query: {
                    name: '[name].[ext]?[hash]'
                }
            },
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                options: {
                    plugins: [require.resolve('react-refresh/babel')],
                },
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

                ]
            }
        ]
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
                NODE_ENV: JSON.stringify('development'),
                CONTEXT: JSON.stringify(process.env.CONTEXT)
            }
        }),
        new CompressionPlugin({
            filename: '[path].gz[query]',
            algorithm: 'gzip',
            test: /\.js$|\.css$|\.scss$|\.html$|\.eot?.+$|\.ttf?.+$|\.woff?.+$|\.svg?.+$/,
        }),

        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new webpack.IgnorePlugin(/^\.\/auth$/, /firebase$/),
        new webpack.IgnorePlugin(/^\.\/storage$/, /firebase$/),
        new webpack.IgnorePlugin(/^\.\/messaging$/, /firebase$/),

        new webpack.HotModuleReplacementPlugin(),
        new ReactRefreshWebpackPlugin(),
    ],
    devServer: {
        historyApiFallback: { index: process.env.CONTEXT },
        host: 'localhost',
        port: 8081,
        hot: true,
        contentBase: './',
    },
    externals
}
