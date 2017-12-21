import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import fastclick from 'fastclick'
import VuelazyLoad from 'vue-lazyload'
import store from './store'

import 'common/js/fontsize.js'
import 'common/sass/icon.scss'

fastclick.attach(document.body)

Vue.use(VuelazyLoad,{
    loading: require('common/images/default.png')
})

new Vue({
    el: '#app',
    render: h => h(App),
    store,
    router
})
