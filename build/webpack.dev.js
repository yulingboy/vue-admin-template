const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const path = require("path");
const env = require("../config/dev.env");
const webpack =require("webpack")
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin'); // 友好错误提示插件

function getLocalIP() {
    const os = require('os');
    const osType = os.type();
    const netInfo = os.networkInterfaces();
    let ip = '';
    if (osType === 'Windows_NT') {
        for (let dev in netInfo) {
            if (dev === '本地连接' || dev === '以太网' || dev === 'WLAN') {
                for (let j = 0; j < netInfo[dev].length; j++) {
                    if (netInfo[dev][j].family === 'IPv4') {
                        ip = netInfo[dev][j].address;
                        break;
                    }
                }
            }
        }

    } else if (osType === 'Linux') {
        ip = netInfo.eth0[0].address;
    }

    return ip;
}

const HOST = getLocalIP() || '127.0.0.1';
const PORT = 9002;
const SERVER = 'http://127.0.0.1:3000'

module.exports = merge(common, {
  mode: "development",
  devServer: {
    hot: true, //热更新
    open: true, //编译完自动打开浏览器
    compress: true, //开启gzip压缩
    port: PORT,
	host: HOST,
    //托管的静态资源文件
    //可通过数组的方式托管多个静态资源文件
    static: {
      directory: path.join(__dirname, "../public"),
    },
    client: {
      //在浏览器端打印编译进度
      progress: true,
    },
    proxy: [
        {
            context: ['**/api/**', '/file/**'],
            target: SERVER,
            logLevel: 'warn',
            secure: false,
        }
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": env,
    }),
    new FriendlyErrorsWebpackPlugin({
        // 成功的时候输出
        compilationSuccessInfo: {
            messages: [`地址：http://${HOST}:${PORT}`, `接口：${SERVER}/api`]
        },
        // 是否每次都清空控制台
        clearConsole: true
    })
  ],
});
