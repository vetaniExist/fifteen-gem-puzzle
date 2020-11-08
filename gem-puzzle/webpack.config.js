const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = (env, options) => {
    const isProd = options.mode === 'production';

    const config = {
        mode: isProd ? 'production' : 'development',
        devtool: isProd ? 'cheap-module-source-map' : 'source-map',
        watch: !isProd, 
        entry: ['./src/js/index.js', './src/css/style.css', './src/css/normalize.css'],
        output: {
            filename: 'main3.js',
            path: path.resolve(__dirname, 'dist'),
        },

        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /nnode_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    }
                },
                {
                    test: /\.css$/,
                    use: [
                        /*'style-loader'*/ MiniCssExtractPlugin.loader,'css-loader', /*'sass-loader'*/
                    ]
                },
                {
                    test: /\.(png|jpe?g|gif|svg)$/i,
                    use: [
                        {
                            loader: 'file-loader',
                        },
                    ],
                },
                {
                    test: /\.html$/i,
                    loader: 'html-loader',
                },
            ]
        },

        plugins:[
            new CleanWebpackPlugin(),
            new HtmlWebpackPlugin({
                template: 'src/index.html'
            }),
            new MiniCssExtractPlugin({
                filename: 'style.css',
            }),
           
            new ESLintPlugin()
        ]
    }
    return config;    
};