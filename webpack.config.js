const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// To tired to make it better now
const toMove = [
    'manifest.json',
    'src/assets/32x32.png',
    'src/assets/24x24.png',
    'src/assets/48x48.png',
    'src/assets/128x128.png',
    'src/assets/16x16.png',
    'src/extension.html',
    'src/assets/js/bootstrap.bundle.min.js',
    'src/assets/css/bootstrap.min.css',
    'src/assets/css/app.css'
];

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
                        const folder = value.replace(/[^\/]*$/, '');
                        const neededFolder = path.join(__dirname, 'dist', folder);

                        if (!fs.existsSync(neededFolder)){
                            fs.mkdirSync(neededFolder, {recursive: true}, err => (err) ? console.error(err) : '');
                            console.log(neededFolder, 'successfully created');
                        }
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
        background: path.join(__dirname, 'src', 'background.ts'),
        popup: path.join(__dirname, 'src', 'popup.ts')
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
            },
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