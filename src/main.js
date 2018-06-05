import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import fastclick from 'fastclick'
import VuelazyLoad from 'vue-lazyload'
import store from './store'
import {SET_PLAY_HISTORY, SET_FAVORITE_LIST} from './store/mutation-types'
import {loadPlay, loadFavorite} from 'common/js/cache'
import {processSongsUrl} from 'common/js/song'

import 'common/js/fontsize.js'
import 'common/sass/icon.scss'

fastclick.attach(document.body)

Vue.use(VuelazyLoad, {
    loading: require('common/images/default.png')
})

/*const historySongs = loadPlay()
processSongsUrl(historySongs).then((songs) => {
    store.commit(SET_PLAY_HISTORY, songs)
})

const favoriteSongs = loadFavorite()
processSongsUrl(favoriteSongs).then((songs) => {
    store.commit(SET_FAVORITE_LIST, songs)
})*/

new Vue({
    el: '#app',
    render: h => h(App),
    store,
    router
})