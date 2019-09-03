module.exports = {
    publicPath: '',
    productionSourceMap: false,
    filenameHashing: false,
    devServer: {
        open: true,
        proxy: {
            '/api':{
                target: 'http://localhost:8088/',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    },
    chainWebpack: config => {
        // 删除相差的配置
        config.plugins.delete('preload')
        config.plugins.delete('prefetch')
    }
}
