# rideofo

> PWA ofo

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080

npm start

npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

## 发布测试环境

npm run deploy:dev

## Root Folder Structure

``` bash

├── README.md                        # 项目介绍
├── build                            #  
│   ├── build.js
│   ├── check-versions.js
│   ├── dev-client.js
│   ├── dev-server.js
│   ├── load-minified.js
│   ├── service-worker-dev.js
│   ├── service-worker-prod.js
│   ├── service-worker.js
│   ├── utils.js
│   ├── vue-loader.conf.js
│   ├── webpack.base.conf.js
│   ├── webpack.dev.conf.js
│   └── webpack.prod.conf.js
├── config                           # 配置文件
│   ├── dev.env.js                   # 开发环境
│   ├── index.js                     # 入口文件
│   └── prod.env.js                  # 线上环境
├── dev.html                         # 测试模版
├── dist                             # 打包目录
│   ├── index.html
│   ├── service-worker.js
│   └── static
│       ├── css
│       ├── img
│       ├── js
│       ├── manifest.json
│       ├── offline.html
│       └── tone
├── index.html                      # 线上模版
├── package-lock.json
├── package.json                    # 项目依赖包管理文件
├── src                             # 主文件入口 开发目录
│   ├── App.vue                     # 根组件
│   ├── assets                      # 资源文件目录
│   │   └── android_232多语言
│   ├── axios                       # 封装axios请求
│   │   └── axios_http.js
│   ├── common                      # 公用方法、样式
│   │   ├── css
│   │   └── js
│   ├── components                  # 主要组件
│   │   ├── cycling.vue             # 骑行界面
│   │   ├── end.vue                 # 结束界面
│   │   ├── endAndPay.vue           # 骑行中界面
│   │   ├── home.vue                # 首页界面
│   │   └── scancode.vue            # 扫码界面
│   ├── https                       # 启动 https服务 所依赖的文件
│   │   ├── certificate.pem
│   │   └── key.pem
│   ├── main.js                     # 项目入口js文件
│   ├── router                      # vue-router 配置文件目录
│   │   └── index.js
│   └── utils                       # 公用工具
│       ├── llqrcode.js
│       ├── qr_packed.js
│       ├── scan.js
│       └── webqr.js
├── static                          # 静态资源 无压缩 直接COPY -> dist/static
│   ├── img                         # 图片目录
│   │   ├── aog                     # AOG 图片
│   │   ├── home-slices
│   │   ├── icons                   # manifest 所需图片
│   │   └── riding
│   ├── manifest.json               # manifest配置文件
│   ├── offline.html                # 离线页面
│   └── tone                        # AOG 引用文件
│       └── bike\ tone.mp3
└── tools                           # 部署测试环境目录
    ├── deploy.js
    ├── deploy_dev.js
    ├── package-lock.json
    ├── package.json
    ├── publish.sh
    └── publish_dev.sh

```

参考地址  [guide](https://github.com/Plortinus/vue-multiple-pages)


For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).


## pub Google analytics

<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-112420721-7"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'UA-112420721-7');
</script>


## dev Google analytics

<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-112420721-8"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'UA-112420721-8');
</script>
