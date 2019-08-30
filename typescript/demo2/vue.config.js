module.exports = {
    runtimeCompiler: true,
    publicPath: '',
    productionSourceMap: false,
    filenameHashing: false,
    devServer: {
        port: 8080,
        open: true,
        proxy: ''
    },
    // webpack 链接 API，用于生成和修改 webapck 配置
    // https://github.com/mozilla-neutrino/webpack-chain
    chainWebpack: config => {
         // 因为是多页面，所以取消 chunks，每个页面只对应一个单独的 JS / CSS
        config.plugins.delete('preload')
        config.plugins.delete('prefetch')
    },
    configureWebpack: {
        // externals: {
        //     'vue': 'Vue',
        //     'vue-router': 'VueRouter',
        //     'vuex': 'Vuex',
        //     'element-ui': 'Element',
        //     'axios': 'axios',
        //     'moment': 'moment'
        // }
    }
}