const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,

  devServer: {
    port: 7070,
    // 允许所有主机名访问
    allowedHosts: 'all',
    /* 解读为加链接头，开启跨域，加/api作为识别。
意为请求/api下的链接，直接回转到target */
    proxy: {
      '/api': {
         // target: 'http://localhost:8080', // 代理地址，这里设置的地址会代替axios中设置的baseURL
        target: `${process.env.VUE_APP_PROXY_TARGET}`, // 代理地址，这里设置的地址会代替axios中设置的baseURL
        changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
        secure: true,
        pathRewrite: { // pathRewrite方法重写url
          '^/api': ''
        }
      }
    }, 
    client: {
      overlay: false
    }
  }
  // ...其他配置
  // css: {
  //   loaderOptions: {
  //     postcss: {
  //       postcssOptions: {
  //         plugins: [
  //           require('postcss-pxtorem')({
  //             rootValue: 37.5,
  //             propList: ['*']
  //           })
  //         ]
  //       }
  //     }
  //   }
  // }
})
