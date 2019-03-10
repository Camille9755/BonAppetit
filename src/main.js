// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import {Button} from 'mint-ui'

import './mock/mockServer'
import router from './router'
import store from './store'
/* eslint-disable no-new */

Vue.component(Button.name,Button)

new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store
})
