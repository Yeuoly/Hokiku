import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import VueCookie from 'vue-cookie'
import VueRouter from 'vue-router'
import axios from 'axios'
import VueAxios from 'vue-axios'

import './style/font.css'
import route from './router/router'

(async function(){
  Vue.config.productionTip = false

  const originalPush = VueRouter.prototype.push
  const originalReplace = VueRouter.prototype.replace
  VueRouter.prototype.push = function push(location, onResolve, onReject) {
    if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
    return originalPush.call(this, location).catch(err => err)
  }
  VueRouter.prototype.replace = function push(location, onResolve, onReject) {
      if (onResolve || onReject) return originalReplace.call(this, location, onResolve, onReject)
      return originalReplace.call(this, location).catch(err => err)
  }
  Vue.use(VueRouter)
  
  Vue.use(VueCookie)
  
  //初始化axios
  if(process.env.NODE_ENV == "development"){
    axios.defaults.baseURL = "http://127.0.0.1:8010"
  }else{
    axios.defaults.baseURL = ""
  }
  axios.defaults.withCredentials = true
  axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
  Vue.use(VueAxios, axios)
  
  //初始化用户认证
  
  const router = new VueRouter(route)

  new Vue({
    vuetify,
    router,
    render: h => h(App)
  }).$mount('#app')
  
  router.push('reg')
})()