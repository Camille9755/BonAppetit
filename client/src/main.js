// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import {Button} from 'mint-ui'
import VueLazyLoad from 'vue-lazyload'

import './mock/mockServer'
import './filters'
import router from './router'
import store from './store'
import loading from './common/imgs/loading.gif'
/* eslint-disable no-new */

Vue.component(Button.name,Button)
Vue.use(VueLazyLoad,{
  loading
})

new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store
})
