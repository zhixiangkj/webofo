// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './axios/axios_http.js'
import './common/js/rem.js'
import './common/css/reset.css'
import '../build/service-worker-prod.js'
// import message from './utils/message/index'
Vue.config.productionTip = false

// Vue.use(message)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
