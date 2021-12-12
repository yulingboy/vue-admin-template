const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader'); // vue加载器

module.exports = {
    entry: path.resolve(__dirname, "../src/main.js"),
    output: {
        path: path.resolve(__dirname, "../dist"),
        // filename: "[name].[contenthash:8].js",
        filename: 'static/js/[name].[contenthash:8].bundle.js',
        clean: true, //每次构建清除dist包
    },
    plugins: [
        // 将文件从目标文件夹复制到目标文件夹
        //  new CopyWebpackPlugin({
        //     patterns: [
        //         {
        //             from: path.resolve(__dirname, "../static"),
        //             to: 'static',
        //             globOptions: {
        //                 ignore: ['*.DS_Store'],
        //             },
        //             noErrorOnMissing: true,
        //         },
        //     ],
        // }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "../public/index.html"),
            filename: "index.html", // output file
        }),

        new MiniCssExtractPlugin({
            filename: "static/css/[name].css",
        }),
        new VueLoaderPlugin(),

    ],
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                include: [path.resolve(__dirname, '../src')]
            },
            {
                test: /\.(css|scss|sass)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "sass-loader",
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                plugins: ["autoprefixer"],
                            },
                            name: "static/css/[name].[hash:7].[ext]",
                        },
                    },
                ],
            },
            {
                test: /\.(png|jpe?g|gif|svg|ico)(\?.*)?$/,
                loader: "url-loader",
                type: "javascript/auto", //解决asset重复
                options: {
                    esModule: false, //解决html区域,vue模板引入图片路径问题
                    limit: 1000,
                    name: "static/img/[name].[hash:7].[ext]",
                },
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: "url-loader",
                options: {
                    limit: 10000,
                    name: "static/media/[name].[hash:7].[ext]",
                },
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
                loader: "url-loader",
                options: {
                    limit: 10000,
                    name: "static/fonts/[name].[hash:7].[ext]",
                },
            },
            {
                test: /(\.jsx|\.js)$/,
                use: ["babel-loader"],
                exclude: /node_modules/,
            },

        ],
    },
    resolve: {
        extensions: [".js", ".jsx", ".json", ".vue"], //省略文件后缀
        alias: { //配置别名
            "@": path.resolve(__dirname, "../src"),
        },
    },
    stats: 'errors-only', // 只在发生错误时输出
    cache: {
        type: 'filesystem', // 使用文件缓存
    },
};