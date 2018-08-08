// 引用 vue 没什么要说的
import Vue from 'vue'
// 引用路由
import VueRouter from 'vue-router'
// 光引用不成，还得使用
Vue.use(VueRouter);
// 入口文件为 src/App.vue 文件 所以要引用
import App from './App.vue'
// 引用路由配置文件
import routes from './config/routes'
import store from './store'
import VueAwesomeSwiper from 'vue-awesome-swiper'
// import 'swiper/dist/css/swiper.css'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
Vue.use(MintUI)
// 引用移动端适配方案
import 'lib-flexible'
Vue.use(VueAwesomeSwiper)

import global from './config/global'
Vue.prototype.global = global
const router = new VueRouter({
  routes
});
// 跑起来吧
new Vue({
  router,
  el: '#app',
  render: (h) => h(App)
});
