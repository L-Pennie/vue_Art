module.exports = {
    devServer: {
        host: '', //将浏览地址的本地服务修改为本机ip地址
        port: 6060, //端口号
    },
    configureWebpack: {
        externals: {
            // 全局常量定义出，也可以是window下的实例
            'AMap': 'AMap' // 高德地图配置
        },
        resolve: {
            alias: {
                'vue$': 'vue/dist/vue.esm.js'
            }
        }
    },
}