/**
 * Created by Athrunsky on 2017/7/20.
 */
// 引用模板
import NotFoundComponent from '../components/NotFoundComponent.vue'
import index from '../components/index.vue'
import taskDetail from '../components/taskDetail.vue'
import checkList from '../components/checkList.vue'
import checkDetail from '../components/checkDetail.vue'
import uploadPic from '../components/uploadPic.vue'
import vueSwiper from '../components/vueSwiper.vue'
import demo from '../components/demo.vue'
// 配置路由
export default [
  // {
  //   path: '*', 
  //   component: NotFoundComponent
  // },
  {
    path: '/',
    component: index
  },
  {
    path: '/taskDetail/:id',
    component: taskDetail
  },
  {
    path: '/checkList/:id/:taskId',
    component: checkList
  },
  {
    path: '/checkDetail/:taskId/:id/:status',
    component: checkDetail
  },
  {
    path: '/uploadPic',
    component: uploadPic
  },
  {
    path: '/vueSwiper/:taskId/:id/:status',
    component: vueSwiper
  },
  {
    path: '/demo',
    component: demo
  }
]
