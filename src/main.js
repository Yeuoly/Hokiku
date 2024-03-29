import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import VueCookie from 'vue-cookie'
import VueRouter from 'vue-router'
import axios from 'axios'
import VueAxios from 'vue-axios'

import './style/font.css'
import './style/common.css'
import './style/hljs.css'
import './util'
import route from './router/router'
import { api_auth_check, api_user_heartbeat } from './interface/api'
import store from './store'

import EchartsTheme from './style/echarts_theme.json'

import VueEcharts from 'vue-echarts'
import { disableHeader, disableSideMenu, launchHeader, launchSideMenu } from './concat/bus'

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
  
  //初始化echarts并注册主题

  VueEcharts.registerTheme('theme', EchartsTheme)
  Vue.component('v-chart', VueEcharts)

  //初始化axios
  if(process.env.NODE_ENV == "development"){
    XMLHttpRequest.prototype.__open = XMLHttpRequest.prototype.open
    XMLHttpRequest.prototype.open = function(method, url){
      if(url.slice(0, 34) == "http://127.0.0.1:8080/sockjs-node/"){
        this.__open(method, `http://${process.env.VUE_APP_FRONTEND_BASE_URL}/sockjs-node/` + url.slice(34))
      }else{
        this.__open(method, url)
      }
    }
  }

  axios.defaults.baseURL = `http://${process.env.VUE_APP_BACKEND_BASE_URL}`
  axios.defaults.withCredentials = true
  axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
  Vue.use(VueAxios, axios)

  try{
    const { data } = await api_auth_check()
    if (data['res'] > 0) {
      api_user_heartbeat()
      setInterval(() => {
        api_user_heartbeat()
      }, 60000)
      store.commit('setOnlineState', true)
      store.commit('setUsername', data['data']['nickname'])
      store.commit('setUserUid', data['data']['uid'])
      store.commit('setUserPowers', data['data']['powers'])
      store.commit('setUserStatus', data['data']['status'])
      store.commit('setUserEmail', data['data']['email'])
      if (data['data']['avatar'] == '') {
        store.commit('setUserAvatar', 'https://yeuoly.oss-cn-beijing.aliyuncs.com/irina/static/default_avatar.jpg')
      } else {
        store.commit('setUserAvatar', data['data']['avatar'])
      }
    }
  }catch(e){
    store.commit('setOnlineState', false)
    store.commit('setUserAvatar', 'https://yeuoly.oss-cn-beijing.aliyuncs.com/irina/static/default_avatar.jpg')
  }

  const router = new VueRouter(route)

  router.afterEach( e => {
    if(e.meta.disableSideMenu){
      disableSideMenu()
    }else{
      launchSideMenu()
    }

    if(e.meta.disableHeader){
      disableHeader()
    }else{
      launchHeader()
    }
  })

  new Vue({
    store,
    vuetify,
    router,
    render: h => h(App)
  }).$mount('#app')
  
})()