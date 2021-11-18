const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

const toMove = ['manifest.json'];

class MakeDistAndCopyPlugin {
    apply(compiler) {
      compiler.hooks.emit.tapAsync(
        'MakeDistPlugin',
        (compilation, callback) => {
            const dir = path.join(__dirname, 'dist');

            if (!fs.existsSync(dir)){
                fs.mkdirSync(dir);
            }

            if (toMove && toMove.length > 0) {
                toMove.forEach(value => {
                    const filePath = path.join(__dirname, value);

                    if (!fs.existsSync(filePath)) {
                        console.error(`${value} doesn't exists`);
                        return;
                    }

                    fs.copyFile(filePath, path.join(__dirname, 'dist', value), (err) => {
                        if (err) {
                            throw err;
                        }

                        console.log(`Copied ${value} to dist folder`);
                    });
                })
            }

          callback();
        }
      );
    }
}

module.exports = {
    entry: {
        extension: path.join(__dirname, 'src', 'extension.ts'),
        background: path.join(__dirname, 'src', 'background.ts')
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
        new MakeDistAndCopyPlugin()
    ]
};