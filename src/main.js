// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import 'iview/dist/styles/iview.css'
import axios from 'axios'
import VueHtml5Editor from 'vue-html5-editor'
import vueHtml5EditorConfig from './config/vue-html5-editor-config'
import url from './config/url'
import './assets/css/iconfont/iconfont.css'

Vue.config.productionTip = false
Vue.prototype.axios = axios
Vue.prototype.url = url

Vue.use(VueHtml5Editor, vueHtml5EditorConfig)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
