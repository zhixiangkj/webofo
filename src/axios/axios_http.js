import Vue from 'vue'
import axios from 'axios'
if (process.env.NODE_ENV === 'development') {
  axios.defaults.baseURL = '//ofoapi-qa.ofo.com'
}
if (process.env.NODE_ENV === 'production') {
  axios.defaults.baseURL = '//one.ofo.com'
}

// 组件
var Createhttp = {
  install: function (Vue) {
    let axiosCase1 = axios.create({
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      timeout: 10 * 1000
    })
    // axiosCase1.interceptors.request.use((config) => {
    //   if (config.method == 'post') {
    //     config.data = JSON.stringify(config.data)
    //     config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    //   }
    //   return config
    // }, (error) => {
    //   return Promise.reject(error)
    // })
    let axiosCase2 = axios.create({
      headers: { 'content-type': 'application/x-www-form-urlencoded; charset=UTF-8' }
    })
    // 拦截器
    // axiosCase2.interceptors.request.use(
    //   config => {
    //     // config 的值是一个对象
    //     config.headers.Authorization = token
    //     return config
    //   },
    //   error => {
    //     return Promise.reject(error)
    //   }
    // )
    Object.defineProperty(Vue.prototype, '$http', {
      value: axiosCase1
    })
    Object.defineProperty(Vue.prototype, '$http_token', {
      value: axiosCase2
    })
  }
}

Vue.use(Createhttp)
