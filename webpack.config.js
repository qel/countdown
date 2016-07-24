var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: __dirname + '/src/index.jsx',
    output: {
        filename: 'index.js',
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
            }
        ]
    },
    resolve: {
        root: path.resolve('./src'),
        extensions: ['', '.js', '.jsx']
    }
};
