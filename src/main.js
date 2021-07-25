import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import VueCookie from 'vue-cookie'
import VueRouter from 'vue-router'
import axios from 'axios'
import VueAxios from 'vue-axios'

import './style/font.css'
import './style/common.css'
import './util'
import route from './router/router'
import { api_auth_check, api_get_csrftoken } from './interface/api'
import store from './store'

import EchartsTheme from './style/echarts_theme.json'

import VueEcharts from 'vue-echarts'

import { getCsrftoken, setCsrftoken } from './interface/api'

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
    axios.defaults.baseURL = "http://127.0.0.1:8010"
  }else{
    axios.defaults.baseURL = ""
  }
  axios.defaults.withCredentials = true
  axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
  Vue.use(VueAxios, axios)

  //初始化用户认证，初始化csrf_token
  try{
    if(!getCsrftoken()){
      await api_get_csrftoken()
      setCsrftoken(VueCookie.get('irina_jct'))
    }

    const { data } = await api_auth_check()
    if (data['res'] > 0) {
      store.commit('setOnlineState', true)
      store.commit('setUsername', data['data']['nickname'])
      store.commit('setUserUid', data['data']['uid'])
      store.commit('setUserPowers', data['data']['powers'])
      store.commit('setUserStatus', data['data']['status'])
      store.commit('setUserEmail', data['data']['email'])
    }
  }catch(e){
    store.commit('setOnlineState', false)
  }

  const router = new VueRouter(route)

  new Vue({
    store,
    vuetify,
    router,
    render: h => h(App)
  }).$mount('#app')
  
})()