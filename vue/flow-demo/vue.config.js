module.exports = {
    publicPath: '/',
    productionSourceMap: false,
    filenameHashing: false,
    devServer: {
        overlay: {
          warnings: false,
          errors: false
        },
        port: 8080,
        open: true,
        proxy: {
            '/get_weather': {
                /* 目标代理服务器地址 */
                target: 'http://enywechat.chinaacdm.com',
                /* 允许跨域 */
                changeOrigin: true,
            }
        }
    },
    chainWebpack: config => {
        // 删除相差的配置
        config.plugins.delete('preload')
        config.plugins.delete('prefetch')
    },
    configureWebpack: {
        externals: {
            'go': 'go'
        },
        plugins: [
            require('autoprefixer')
        ]
    }
}
