import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false;
//1.导入 (导入之前线npm install vue-router)
import VueRouter from 'vue-router';
//2.use
Vue.use(VueRouter);
//3.创建路由

// 5导入需要通过路由管理的组件
import discovery from './views/01.discovery'
import playlists from './views/02.playlists'
import songs from './views/03.songs'
import mvs from './views/04.mvs'
import result from './views/05.result'
import playlist from './views/06.playlist'
import mv from './views/07.mv'

//6创建路由
let router = new VueRouter({
    routes: [
        //默认显示的组件
        {
            path: "/",
            component: discovery
        },
        //7.配置地址和组件的对应关系
        {
            //地址 地址随便写，但是你就这样去访问它
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

//使用Element-ui
//1.导入element-ui
import ElementUI from 'element-ui'
//2.导入element-ui样式
import 'element-ui/lib/theme-chalk/index.css';
//3.use一下
Vue.use(ElementUI);
//4.然后想用哪个复制哪个

new Vue({
    render: h => h(App),
    //4.挂载到vue实例上
    router: router
}).$mount('#app')