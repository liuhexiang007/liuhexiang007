// 判断页面按钮是否显示
export default {
  install(Vue) {
    Vue.prototype.isHaveButton = isHaveButton
  }
}
function isHaveButton(data) {
  if (data) {
    let permissions = this.$store.getters.permissionList
    if (permissions.length > 0) {
      permissions = JSON.parse(permissions)
      const allButton = []
      permissions.forEach(item1 => {
        if (item1.menuType === 'F') {
          permissions.forEach(item2 => {
            if (item1.parentId && item1.parentId === item2['menuId']) {
              const buttonTag = `${item2.path}${item1.path}`
              allButton.push(buttonTag)
            }
          })
        }
        // const childMenus1 = item1.childMenus
        // childMenus1.forEach(item2 => {
        //   const childMenus2 = item2.childMenus
        //   if (childMenus2) {
        //     childMenus2.forEach(item3 => {
        //       const buttonTag = `${item2.menuInfo.path}${item3.menuInfo.path}`
        //       allButton.push(buttonTag)
        //     })
        //   }
        // })
      })
      return allButton.includes(data)
    }
  }
}
