const Path = require('path');
const outPath = Path.join(__dirname, './build');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')


module.exports = (env, argv) => {
    return {
        entry: "./src/app/app.tsx",
        output: {
            path: outPath,
            publicPath: '/',
            filename: 'app_bundle.js',
        },
        target: 'electron-renderer',
        // Enable sourcemaps for debugging webpack's output.
        devtool: argv.mode == 'production' ? '' : 'source-map',
        resolve: {
            extensions: [".ts", ".tsx", ".js"]
        },
        devServer: {
            contentBase: './build',
            index: 'index.html',
        },
        module: {
            rules: [
                // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
                { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
                {
                    test: /\.(scss)|(css)$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: "css-loader",
                            options: {
                                sourceMap: true,
                            }
                        },
                        "sass-loader"
                    ]
                }
            ]
        },
        plugins: [
            new MiniCssExtractPlugin({
                // Options similar to the same options in webpackOptions.output
                // both options are optional
                filename: "style.css",
                chunkFilename: "[name].css"
            }),
            new CopyWebpackPlugin([
                'src/app/index.html',
            ])
        ]
    }
};