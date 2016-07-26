const baseConfig = require('./webpack.config');

module.exports = Object.assign(baseConfig, {
    plugins:[
        new webpack.DefinePlugin({
            'process.env':{
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress:{
                warnings: false,
                screw_ie8: true
            },
            comments: false,
            sourceMap: false
        })
    ]
});
