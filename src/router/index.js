import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/login/login'
import Admin from '../components/Admin.vue'
import Xunleipu from '../components/xunleipu/index.vue'
import Hao6v from '../components/hao6v/index.vue'
import Movie from '../components/movie/index.vue'
import Moviepreview from '../components/moviereview/index.vue'
import Moviedownload from '../components/moviedownloadlink/index.vue'

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
        {path: 'hao6v', component: Hao6v, name: 'hao6v'},
        {path: 'movie', component: Movie, name: 'movie'},
        {path: 'moviepreview', component: Moviepreview, name: 'moviepreview'},
        {path: 'moviedownloadlink', component: Moviedownload, name: 'moviedownloadlink'},
      ]
    }
  ]
})
