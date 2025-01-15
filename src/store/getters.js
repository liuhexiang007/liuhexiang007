const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  permissionList: state => state.user.permissionList,
  userInfo: state => state.user.userInfo,
  languageTag: state => state.language.languageTag,
  batchNoTag: state => state.batchNo.batchNoTag
}

export default getters
