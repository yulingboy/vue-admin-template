const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin; 
const CompressionPlugin = require("compression-webpack-plugin");
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = merge(common, {
  mode: "production",
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: "html-loader",
        // options: {
        //   esModule: false, //在开发环境中启用false
        // },
      },
    ],
  },
  plugins:[
    // new BundleAnalyzerPlugin(),
    new CompressionPlugin(),
    new CssMinimizerPlugin(),
]
});
