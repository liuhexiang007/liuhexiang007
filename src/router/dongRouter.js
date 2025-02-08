/**
 * router/dongRouter.js
 */
import router from './index'
import store from './../store'
/* Layout */
import Layout from '@/layout'

function createRouterDiGui(arr) {
  const subRoutes = []
  arr.forEach((item) => {
    const children = []
    if (!item.parentId) {
      arr.forEach((data) => {
        if (data.parentId && data.parentId === item['menuId']) {
          const component = loadView(item.path, data.path)
          children.push({
            path: data.path,
            name: data.menuName,
            component: component,
            meta: { title: data.menuName },
            hidden: data.visible === '1'
          })
        }
      })
      let icon = 'account'
      if (item.component === 'VN') {
        icon = 'account'
      } else if (item.component === 'Replacement') {
        icon = 'files'
      } else if (item.component === 'Search') {
        icon = 'file'
      } else if (item.component === 'PO') {
        icon = 'details'
      } else if (item.component === 'Report') {
        icon = 'data'
      } else if (item.component === 'Account') {
        icon = 'my'
      }
      let redirect = ''
      if (children && children.length > 0) {
        redirect = `${item.path}${children[0].path}`
      } else {
        redirect = `${item.path}}`
      }
      subRoutes.push({
        path: item.path,
        component: Layout,
        redirect: redirect,
        name: item.menuName,
        meta: { title: item.menuName, icon: icon },
        children: children
      })
    }
  })

  // arr.forEach((temp) => {
  //   const item = temp.menuInfo
  //   const children = []
  //   temp.childMenus.forEach(data => {
  //     data = data.menuInfo
  //     const component = loadView(item.path, data.path)
  //     children.push({
  //       path: data.path,
  //       name: data.name,
  //       component: component,
  //       meta: { title: data.label },
  //       hidden: data.isHidden === 1
  //     })
  //   })
  //   let icon = 'account'
  //   if (item.name === 'Predictive') {
  //     icon = 'start'
  //   } else if (item.name === 'Model') {
  //     icon = 'weight'
  //   } else if (item.name === 'Vehicle') {
  //     icon = 'screen'
  //   } else if (item.name === 'Data') {
  //     icon = 'device'
  //   } else if (item.name === 'SpareParts') {
  //     icon = 'report'
  //   } else if (item.name === 'AlertSettings') {
  //     icon = 'account'
  //   }
  //   subRoutes.push({
  //     path: item.path,
  //     component: Layout,
  //     redirect: `${item.path}${children[0].path}`,
  //     name: item.name,
  //     meta: { title: item.label, icon: icon },
  //     children: children
  //   })
  // })
  return subRoutes
}

// 执行动态添加路由
async function DynamicAddRouter() {
  return new Promise((resolve) => {
    // router.addRoutes(router.options.routes)
    // resolve()
    let subRoutes = []
    // 从vuex里取出路由信息
    store.dispatch('user/getRouter').then((menuList) => {
      // 添加 Accuracy Report 到 Report 菜单下
      const reportMenu = menuList.find(item => item.component === 'Report')
      if (reportMenu) {
        console.log(menuList, 'eeeeeeeeeeeeeeeeeeeeeeee')
        menuList.push({
          menuId: '1852246054658004000',
          component: 'accuracyReport',
          parentId: reportMenu.menuId,
          parentName: 'Report',
          path: 'accuracyReport',
          menuName: 'Accuracy Report',
          name: 'AccuracyReport',
          orderNum: 999,
          visible: '0'
        })
      }
      subRoutes = createRouterDiGui(menuList)
      router.options.routes = [...subRoutes]
      router.addRoutes(router.options.routes)
      resolve()
    })
  })
}
export const loadView = (path1, path2) => {
  return (resolve) => {
    if (path2 === 'accuracyReport') {
      return require(['@/views/report/accuracyReport.vue'], resolve)
    }
    return require([`@/views${path1}${path2}`], resolve)
  }
}
export default {
  DynamicAddRouter: DynamicAddRouter
}
