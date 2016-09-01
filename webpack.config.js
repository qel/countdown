const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: __dirname + '/src/app.jsx',
    output: {
        filename: 'app.js',
        path: __dirname + '/lib',
        publicPath: '/lib'
    },
    module: {
        loaders: [
            {
                test: /(\.jsx|\.js)$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /(\.jsx|\.js)$/,
                loader: "eslint-loader",
                exclude: /node_modules/
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            }
        ]
    },
    resolve: {
        root: path.resolve('./src'),
        extensions: ['', '.js', '.jsx', '.json']
    }
};
