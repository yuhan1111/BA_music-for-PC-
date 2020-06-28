import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false;
import VueRouter from 'vue-router';
Vue.use(VueRouter);

import discovery from './views/01.discovery'
import playlists from './views/02.playlists'
import songs from './views/03.songs'
import mvs from './views/04.mvs'
import result from './views/05.result'
import playlist from './views/06.playlist'
import mv from './views/07.mv'

let router = new VueRouter({
    routes: [
        {
            path: "/",
            component: discovery
        },
        {
            path: "/discovery",
            component: discovery
        },
        {
            path: "/playlists",
            component: playlists
        },
        {
            path: "/songs",
            component: songs
        },
        {
            path: "/mvs",
            component: mvs
        },
        {
            path: "/result",
            component: result
        },
        {
            path: "/playlist",
            component: playlist
        },
        {
            path: "/mv",
            component: mv
        },
    ]
})

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

new Vue({
    render: h => h(App),
    router: router
}).$mount('#app')
