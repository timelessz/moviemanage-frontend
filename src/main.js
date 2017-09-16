// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'iview/dist/styles/iview.css';

// 添加拓展 类库
window.axios = require('axios')
window.moment = require('axios')
window.Cookies = require('js-cookie')
window.Lockr = require('lockr')
let iView = require('iview')
Vue.use(iView)

Vue.config.productionTip = false

let domain = 'api.salesman.cc'
let HOST = 'http://' + domain + '/index.php/'
// let ROOTHOST = 'http://' + domain + '/'

window.axios.defaults.baseURL = HOST
// 请求超时时间
window.axios.defaults.timeout = 1000 * 15
// 默认返回值json
window.axios.defaults.headers['Content-Type'] = 'application/json'
// 实现跨域操作
window.axios.defaults.withCredentials = true


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
