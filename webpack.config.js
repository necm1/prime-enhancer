const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// To tired to make it better now
const toMove = ['manifest.json', 'src/assets/icon.png', 'src/assets/16x16.png'];

class MakeDistAndCopyPlugin {
    apply(compiler) {
      compiler.hooks.emit.tapAsync(
        'MakeDistPlugin',
        (compilation, callback) => {
           const distFolder = path.join(__dirname, 'dist');

            if (!fs.existsSync(distFolder)){
                fs.mkdirSync(distFolder);
                console.log(distFolder, 'successfully created');
            }

            if (toMove && toMove.length > 0) {
                toMove.forEach(value => {
                    const filePath = path.join(__dirname, value);

                    if (!fs.existsSync(filePath)) {
                        console.error(`${value} doesn't exists`);
                        return;
                    }

                    // Remove src from path
                    if (value.includes('src/')) {
                        value = value.replace('src/', '');
                    }

                    if (value.includes('/')) {
                        value.split('/').forEach(folder => {
                            if (folder.includes('.')) {
                                return;
                            }

                            console.log(path.join(__dirname, 'dist', folder));

                            const neededFolder = path.join(__dirname, 'dist', folder);

                            if (!fs.existsSync(neededFolder)){
                                fs.mkdirSync(neededFolder, {}, err => (err) ? console.error(err) : '');
                                console.log(neededFolder, 'successfully created');
                            }
                        })
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
        new CleanWebpackPlugin({
            protectWebpackAssets: false,
            cleanAfterEveryBuildPatterns: ['!manifest.json', '!assets/**', '*.LICENSE.txt']
        }),
        new MakeDistAndCopyPlugin(),
    ]
};