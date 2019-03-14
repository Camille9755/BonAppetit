import format from 'date-fns/format'
import Vue from 'vue'
Vue.filter('dateString',function (value,formatStr) {
  return format(value,formatStr||'YYYY-MM-DD HH:mm:ss')
})
