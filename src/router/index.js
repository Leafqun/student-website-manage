import Vue from 'vue'
import Router from 'vue-router'
import LoadingBar from 'iview/src/components/loading-bar'
import store from '../store'

// 路由组件（懒加载）
const Login = () => import('@/components/login/login')
const Main = () => import('@/components/manage/main')
const NoticeManage = () => import('@/components/manage/notice_manage')
const NoticeEdit = () => import('@/components/manage/notice_edit')
const MessageManage = () => import('@/components/manage/message_manage')
const DownloadManage = () => import('@/components/manage/download_manage')
const CourseManage = () => import('@/components/manage/course_manage')
const CourseEdit = () => import('@/components/manage/course_edit')
const CourseFileManage = () => import('@/components/manage/course_file_manage')
const Profile = () => import('@/components/manage/profile_edit')
const Faculty = () => import('@/components/manage/faculty_edit')
const Management = () => import('@/components/manage/management_edit')

Vue.use(Router)

const router = new Router({
  routes: [
    {path: '/', redirect: '/login'},
    {path: '/login', name: 'login', component: Login},
    {
      path: '/manage',
      component: Main,
      redirect: '/manage/notice',
      children: [
        {path: 'notice', name: 'notice', component: NoticeManage},
        {path: 'notice/:noticeId', name: 'noticeEdit', component: NoticeEdit},
        {path: 'notice/add', name: 'noticeAdd', component: NoticeEdit},
        {path: 'message', name: 'message', component: MessageManage},
        {path: 'download', name: 'download', component: DownloadManage},
        {path: 'course', name: 'course', component: CourseManage},
        {path: 'course/:courseId', name: 'courseEdit', component: CourseEdit},
        {path: 'course/add', name: 'courseAdd', component: CourseEdit},
        {path: 'course/:courseId/courseFile', name: 'courseFile', component: CourseFileManage},
        {path: 'profile', name: 'profile', component: Profile},
        {path: 'faculty', name: 'faculty', component: Faculty},
        {path: 'management', name: 'management', component: Management}
      ]
    }
  ]
})
router.beforeEach((to, from, next) => {
  LoadingBar.start()
  console.log(store.state.isLogin)
  if (to.path.indexOf('/manage') === 0) {  // 判断该路由是否需要登录权限
    if (store.state.isLogin === 'login') {  // 通过vuex state获取当前的token是否存在
      next()
    } else {
      next({path: '/login', query: { redirect: to.fullPath }})
    }
  } else {
    next()
  }
})
router.afterEach(route => {
  LoadingBar.finish()
})

export default router
