import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/PO',
    component: Layout,
    redirect: '/PO/poStrategyDetail',
    name: 'PO',
    meta: { title: 'PO', icon: 'shop' },
    children: [
      // {
      //   path: '/poStrategy',
      //   name: 'PoStrategy',
      //   component: () => import('@/views/PO/poStrategy'),
      //   meta: { title: 'PO Strategy' }
      // },
      {
        path: '/poStrategyDetail',
        name: 'PoStrategyDetail',
        component: () => import('@/views/PO/poStrategyDetail'),
        meta: { title: 'PO Strategy Detail' }
      }
    ]
  },
  {
    path: '/replacement',
    component: Layout,
    redirect: '/replacement/patternPlan',
    name: 'Replacement',
    meta: { title: 'Replacement plan', icon: 'data' },
    children: [
      {
        path: '/patternPlan',
        name: 'PatternPlan',
        component: () => import('@/views/replacement/patternPlan'),
        meta: { title: 'Replacement pattern and plan' }
      }
    ]
  },
  {
    path: '/search',
    component: Layout,
    redirect: '/search/patternPlan',
    name: 'Search',
    meta: { title: 'Search', icon: 'data' },
    children: [
      {
        path: '/materialModelSearch',
        name: 'MaterialModelSearch',
        component: () => import('@/views/search/materialModelSearch'),
        meta: { title: 'Material to Model Search' }
      }
    ]
  },
  {
    path: '/report',
    component: Layout,
    redirect: '/report/reportCenter',
    name: 'Report',
    meta: { title: 'Report', icon: 'data' },
    children: [

      {
        path: '/decreasingDemand',
        name: 'DecreasingDemand',
        component: () => import('@/views/report/decreasingDemand'),
        meta: { title: 'Decreasing Demands Report' }
      }, {
        path: '/recommendedStock',
        name: 'RecommendedStock',
        component: () => import('@/views/report/recommendedStock'),
        meta: { title: 'Recommended Stock Report' }
      }, {
        path: '/purchaseReport',
        name: 'PurchaseReport',
        component: () => import('@/views/report/purchaseReport'),
        meta: { title: 'Purchase Report' }
      }, {
        path: '/decreasingGovernment',
        name: 'DecreasingGovernment',
        component: () => import('@/views/report/decreasingGovernment'),
        meta: { title: 'Decreasing Government Report' }
      }

    ]
  },
  {
    path: '/account',
    component: Layout,
    redirect: '/account/accountManagement',
    name: 'Account',
    meta: { title: 'Account', icon: 'my' },
    children: [
      {
        path: '/permissionList',
        name: 'PermissionList',
        component: () => import('@/views/account/permissionList'),
        meta: { title: 'Menu Management' }
      },
      {
        path: '/roleList',
        name: 'RoleList',
        component: () => import('@/views/account/roleList'),
        meta: { title: 'Role Management' }
      },
      {
        path: '/accountManagement',
        name: 'AccountManagement',
        component: () => import('@/views/account/accountManagement'),
        meta: { title: 'Account Management' }
      }
    ]
  },
  // {
  //   path: '/dictionary',
  //   component: Layout,
  //   redirect: '/dictionary/modelManagement',
  //   name: 'Dictionary',
  //   meta: { title: '数据字典', icon: 'report' },
  //   children: [
  //     {
  //       path: '/modelManagement',
  //       name: 'ModelManagement',
  //       component: () => import('@/views/dictionary/modelManagement'),
  //       meta: { title: '业务类型' }
  //     },
  //     {
  //       path: '/workDictionary',
  //       name: 'WorkDictionary',
  //       component: () => import('@/views/dictionary/workDictionary'),
  //       meta: { title: '业务字典' }
  //     }
  //   ]
  // },
  // {
  //   path: '/dataScreen',
  //   component: Layout,
  //   redirect: '/financial/dataScreenInformation',
  //   name: 'DataScreen',
  //   meta: { title: '现场大屏幕', icon: 'el-icon-s-finance' },
  //   children: [
  //     {
  //       path: '/dataScreenInformation',
  //       name: 'DataScreenInformation',
  //       component: () => import('@/views/dataScreen/dataScreenInformation'),
  //       meta: { title: '现场看板' }
  //     },
  //     {
  //       path: '/deviceStatus',
  //       name: 'DeviceStatus',
  //       component: () => import('@/views/dataScreen/deviceStatus'),
  //       meta: { title: '设备状态' }
  //     },
  //     {
  //       path: '/CCTVList',
  //       name: 'CCTVList',
  //       component: () => import('@/views/dataScreen/CCTVList'),
  //       meta: { title: 'CCTV' }
  //     }
  //   ]
  // },
  // {
  //   path: '/deviceManager',
  //   component: Layout,
  //   redirect: '/deviceManager/platformSetting',
  //   name: 'DeviceManager',
  //   meta: { title: '设备管理', icon: 'el-icon-s-order' },
  //   children: [
  //     {
  //       path: '/platformSetting',
  //       name: 'PlatformSetting',
  //       component: () => import('@/views/deviceManager/platformSetting'),
  //       meta: { title: '平台设置' }
  //     },
  //     {
  //       path: '/deviceList',
  //       name: 'DeviceList',
  //       component: () => import('@/views/deviceManager/deviceList'),
  //       meta: { title: '设备列表' }
  //     },
  //     {
  //       path: '/versionManagement',
  //       name: 'VersionManagement',
  //       component: () => import('@/views/deviceManager/versionManagement'),
  //       meta: { title: '版本管理' }
  //     },
  //     {
  //       path: '/newDataCollection',
  //       name: 'NewDataCollection',
  //       component: () => import('@/views/deviceManager/newDataCollection'),
  //       meta: { title: '检测图片' }
  //     },
  //     {
  //       path: '/dataScreenDevice',
  //       name: 'DataScreenDevice',
  //       component: () => import('@/views/deviceManager/dataScreenDevice'),
  //       meta: { title: '设备数据' },
  //       hidden: true
  //     }
  //   ]
  // },
  // {
  //   path: '/dataReport',
  //   component: Layout,
  //   redirect: '/dataReport/dataViewList',
  //   name: 'DataReport',
  //   meta: { title: '数据报表', icon: 'el-icon-s-cooperation' },
  //   children: [
  //     {
  //       path: '/dataViewList',
  //       name: 'DataViewList',
  //       component: () => import('@/views/dataReport/dataViewList'),
  //       meta: { title: '数据查看' }
  //     }
  //   ]
  // },
  // {
  //   path: '/permissions',
  //   component: Layout,
  //   redirect: '/permissions/permissionList',
  //   name: 'Permissions',
  //   meta: { title: '账户管理', icon: 'account' },
  //   children: [
  //     {
  //       path: '/userPermissionSetting',
  //       name: 'UserPermissionSetting',
  //       component: () => import('@/views/permissions/userPermissionSetting'),
  //       meta: { title: '账户设定' }
  //     },
  //     {
  //       path: '/roleList',
  //       name: 'RoleList',
  //       component: () => import('@/views/permissions/roleList'),
  //       meta: { title: '角色列表' }
  //     },
  //     {
  //       path: '/permissionList',
  //       name: 'PermissionList',
  //       component: () => import('@/views/permissions/permissionList'),
  //       meta: { title: '权限列表' }
  //     }
  //   ]
  // },
  // {
  //   path: '/system',
  //   component: Layout,
  //   redirect: '/system/userManagement',
  //   name: 'System',
  //   meta: { title: '系统管理', icon: 'el-icon-s-tools' },
  //   children: [
  //     {
  //       path: '/userManagement',
  //       name: 'UserManagement',
  //       component: () => import('@/views/system/userManagement'),
  //       meta: { title: '用户管理' }
  //     },
  //     {
  //       path: '/organizationList',
  //       name: 'OrganizationList',
  //       component: () => import('@/views/system/organizationList'),
  //       meta: { title: '组织机构' }
  //     },
  //     {
  //       path: '/personalCenter',
  //       name: 'PersonalCenter',
  //       component: () => import('@/views/system/personalCenter'),
  //       meta: { title: '个人中心' },
  //       hidden: true
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
