const autoprefixer = require('autoprefixer');
const pxtorem = require('postcss-pxtorem');
const path = require('path');
const Env = require('./src/env.js');

module.exports = {
    outputDir: process.env.OUT_PUT_DIR,
    publicPath: './',
    configureWebpack: config => {
        config.externals = {
            'vue': 'Vue',
            'vuex': 'Vuex',
            'axios': 'axios',
            'Vue-Lazyload': 'Lazyload',
            'vue-router': 'VueRouter',
        };
    },
    productionSourceMap: false,
    css: {
        loaderOptions: {
            postcss: {
                plugins: [
                    autoprefixer(),
                    pxtorem({
                        rootValue: 37.5,
                        propList: ['*']
                    }),
                ]
            },
            scss: {
                prependData: `@import "~@/style/variables.scss";`
            },
            less: {
                modifyVars: {
                    hack: `true; @import "${path.join(
                        __dirname,
                        '/src/style/vant_theme.less'
                    )}";`
                }
            }
        }
    },
    devServer: {
        // host: '172.16.1.153',
        https: false,
        open: true,
        proxy: {
            '/app': {
                target: Env.baseUrl,
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    '^/app': '/'
                }
            },
        },
    }
};
