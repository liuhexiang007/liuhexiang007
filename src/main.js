import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
import './styles/variables.scss'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

// 在Vue组件中定义过滤器
Vue.filter('formatNumber', function(value) {
  if (!value) return '0'
  const stringified = String(Math.floor(value))
  return stringified.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
})

import '@/styles/index.scss' // global css
import '@/assets/less/TableExpand.less'

import App from './App'
import store from './store'
import router from './router'

import md5 from 'js-md5'
Vue.prototype.$md5 = md5

import VueAwesomeSwiper from 'vue-awesome-swiper'
// import style (>= Swiper 6.x)
import 'swiper/swiper-bundle.css'
Vue.use(VueAwesomeSwiper /* { default options with global component } */)

// 按需引入vue-awesome图标
import Icon from 'vue-awesome/components/Icon'
import 'vue-awesome/icons/chart-bar.js'
import 'vue-awesome/icons/chart-area.js'
import 'vue-awesome/icons/chart-pie.js'
import 'vue-awesome/icons/chart-line.js'
import 'vue-awesome/icons/align-left.js'
// 全局注册图标
Vue.component('icon', Icon)

// 引入echarts
import echarts from 'echarts'
import 'echarts-gl'
import 'echarts/map/js/world.js'
Vue.prototype.$echarts = echarts

import VideoPlayer from 'vue-video-player'
import 'vue-video-player/src/custom-theme.css'
import 'video.js/dist/video-js.css'
Vue.use(VideoPlayer)

const hls = require('videojs-contrib-hls')
Vue.use(hls)

import permissionTool from './utils/permissionTool' // 权限管理工具
Vue.use(permissionTool)

// 将自动注册所有组件为全局组件
import dataV from '@jiaminghi/data-view'
Vue.use(dataV)

import '@/icons' // icon
import '@/permission' // permission control

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)
Vue.prototype.$bus = new Vue()
Vue.config.productionTip = false

import i18n from './language'

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
