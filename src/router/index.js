import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/login/login'
import Admin from '../components/Admin.vue'
import Xunleipu from '../components/xunleipu/index.vue'
import Movie from '../components/movie/index.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/admin',
      name: 'admin',
      component: Admin,
      children: [
        {path: 'xunleipu', component: Xunleipu, name: 'xunleipu'},
        {path: 'movie', component: Movie, name: 'movie'},
      ]
    }
  ]
})
