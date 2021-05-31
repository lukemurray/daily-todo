const Path = require('path');
const outPath = Path.join(__dirname, './build');
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
        devtool: argv.mode == 'production' ? false : 'source-map',
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
                { test: /\.tsx?$/, loader: "ts-loader" },
                {
                    test: /\.(s[ca]ss)|(css)$/,
                    use: [
                        "style-loader",
                        "css-loader",
                        "sass-loader"
                    ]
                },
                {
                    test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    type: 'asset/inline'
                },
                {
                    test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    type: "asset/resource"
                }
            ]
        },
        plugins: [
            new CopyWebpackPlugin({
                patterns: [
                    'src/app/index.html',
                    {from: 'src/icons/**/*', to: 'icons/[name][ext]'}
                ]
            })
        ]
    }
};