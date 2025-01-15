import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import dongRouter from './router/dongRouter'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/poStrategyDetail'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()
  // set page title
  // document.title = getPageTitle(to.meta.title)
  document.title = getPageTitle(to.meta.title)
  // determine whether the user has logged in
  const hasToken = getToken()
  if (hasToken) {
    const permissionList = store.getters.permissionList
    if (!permissionList || permissionList.length <= 0) { // 判断菜单列表是否存在
      await dongRouter.DynamicAddRouter() // 添加动态路由的方法
    }
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next('/')
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        next()
        NProgress.done()
      } else {
        try {
          // get user info
          // await store.dispatch('user/getInfo')
          if (to.path !== '/404') {
            // next(to.path)
            next()
            NProgress.done()
          } else {
            if (to.redirectedFrom === '/') {
              next('/poStrategyDetail')
            } else {
              next(to.redirectedFrom)
            }
            NProgress.done()
          }
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
      NProgress.done()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      // next(`/login?redirect=${to.path}`)
      next(`/login`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
