var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var buildConfigs = [];
const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');


module.exports = {
    entry: './src/index.jsx',
    output: {
        path: path.resolve('dist'),
        filename: 'app-[hash].js',
        publicPath: process.env.CONTEXT
    },
    resolve: {
        extensions: ['.js', '.json', '.jsx']
    },
    module: {
        loaders: [
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
                query: {
                    presets: ['react', ['es2015', { loose: true, modules: false }], 'stage-3']
                }
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
    plugins: [new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: 'index.html',
        inject: 'body',
        vendorsFilename: process.env.CONTEXT
    }), new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify('production'),
            CONTEXT: JSON.stringify(process.env.CONTEXT)
        }
    }), new webpack.optimize.UglifyJsPlugin({
        output: {
            comments: false
        },
        mangle: true,
        sourcemap: false,
        debug: false,
        minimize: true,
        compress: {
            warnings: false,
            screw_ie8: true,
            conditionals: true,
            unused: true,
            comparisons: true,
            sequences: true,
            dead_code: true,
            evaluate: true,
            if_return: true,
            join_vars: true
        }
    }), new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new CompressionPlugin({
            filename: "[path].gz[query]",
            algorithm: "gzip",
            test: /\.js$|\.css$|\.html$|\.eot?.+$|\.ttf?.+$|\.woff?.+$|\.svg?.+$/
        })],
    devServer: {
        historyApiFallback: { index: process.env.CONTEXT },
        host: 'localhost',
        port: 8081,
        contentBase: './',
    },
    externals: {
        // global app config object
        config: JSON.stringify({
            apiUrl: '/rest/online/v1',
            apiUrlv2: '/rest/online/v2'
        })
    },

}
