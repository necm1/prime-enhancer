const webpack = require('webpack');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        extension: path.join(__dirname, 'src', 'extension.ts'),
        background: path.join(__dirname, 'src', 'background.ts'),
    },
    devtool: 'source-map',
    output: {
        publicPath: '.',
        path: path.resolve(__dirname, './dist'),
        filename: '[name].js',
    },
    resolve: {
        extensions: [ '.ts', '.js' ],
    },
    module: {
        rules: [
            {
                test: /\.tsx?/,
                use: [
                    {
                      loader: 'ts-loader',
                      options: {
                        transpileOnly: true
                      }
                    }
                ],
                exclude: /node_modules/,
            }
        ]
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                path.resolve(__dirname, 'manifest.json'),
                path.resolve(__dirname, 'dist'),
            ]
        })
    ]
};