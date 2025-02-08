import request from '@/utils/request'

// PO
// --------------------------PO列表-------------------------
export function getTableMaterialList(params) { // 查询part number列表
  return request({
    url: `/table/material/list/search`,
    method: 'get',
    params
  })
}

export function getTableDateList(params) { // 查询date列表
  return request({
    url: `/table/date/list`,
    method: 'get',
    params
  })
}

export function getTableInfo(params) { // 查询详情
  return request({
    url: `/a1/search`,
    method: 'get',
    params
  })
}

export function tableLimit(data) { // 新增
  return request({
    url: '/a1/limit',
    method: 'post',
    data
  })
}

export function vendorList(params, path) { // 根据material获取vendor列表
  return request({
    url: `/material/vendor/list`,
    method: 'get',
    params
  })
}

export function servicePackList(params, path) { // 根据material获取Service Pack列表
  return request({
    url: `/material/servicePack/list`,
    method: 'get',
    params
  })
}

export function feedbackList(params, path) { // 根据material获取feedback列表
  return request({
    url: `/feedback/list`,
    method: 'get',
    params
  })
}

export function feedbackInsert(data) { // 新增
  return request({
    url: '/feedback/insert',
    method: 'post',
    data
  })
}

export function vendorExport(params) { // 根据material导出
  return request({
    url: `/material/vendor/list/export`,
    method: 'get',
    params
  })
}

export function servicePackExport(params) { // 根据material导出
  return request({
    url: `/material/servicePack/list/export`,
    method: 'get',
    params
  })
}
// 导出准确率报告 根据开始时间与结束时间导出
export function exportAccuracyReport(params) {
  return request({
    url: '/accuracy-report/export',
    method: 'get',
    params, // 其他参数
    responseType: 'blob' // 用于下载文件
  })
}
// AOP
// --------------------------report列表-------------------------
export function a2Update(params) { // a2更新
  return request({
    url: `/a2/update`,
    method: 'get',
    params
  })
}

export function a2List(params, path) { // a2列表
  return request({
    url: `/a2/list/${path.page}/${path.limit}`,
    method: 'get',
    params
  })
}

export function a3Update(params) { // a3更新
  return request({
    url: `/a3/update`,
    method: 'get',
    params
  })
}

export function a4List(params, path) { // a4列表
  return request({
    url: `/a4/list/${path.page}/${path.limit}`,
    method: 'get',
    params
  })
}

export function a4Update(params) { // a4更新
  return request({
    url: `/a4/update`,
    method: 'get',
    params
  })
}

export function a3List(params, path) { // a3列表
  return request({
    url: `/a3/list/${path.page}/${path.limit}`,
    method: 'get',
    params
  })
}

export function c1Update(params) { // c1更新
  return request({
    url: `/c1/update`,
    method: 'get',
    params
  })
}

export function c1List(params, path) { // c1列表
  return request({
    url: `/c1/list/${path.page}/${path.limit}`,
    method: 'get',
    params
  })
}

export function vsnList(params) { // c2 vsnList
  return request({
    url: `/c2/vsns`,
    method: 'get',
    params
  })
}

export function c2Makes(params) { // c2 makeList
  return request({
    url: `/c2/makes`,
    method: 'get',
    params
  })
}

export function c2Models(params) { // c2 modelList
  return request({
    url: `/c2/models`,
    method: 'get',
    params
  })
}

export function c2Search(params) { // c2搜索
  return request({
    url: `/c2/search`,
    method: 'get',
    params
  })
}

export function b4Search(params) { // b4搜索
  return request({
    url: `/b4/search`,
    method: 'get',
    params
  })
}

export function a4Currencies(params) { // 获取货币汇率列表
  return request({
    url: `/a4/currencies`,
    method: 'get',
    params
  })
}

export function a4Currency(data) { // 修改货币汇率
  return request({
    url: '/a4/currency',
    method: 'PUT',
    data
  })
}

// OCR
// --------------------------OCR列表-------------------------
export function uploadRecord(params, path) { // 查询OCR列表
  return request({
    url: `/upload-record/list/${path.page}/${path.limit}`,
    method: 'get',
    params
  })
}

export function uploadRecordGet(params, path) { // 查询详情
  return request({
    url: `/upload-record/get/${path.uploadId}`,
    method: 'get',
    params
  })
}

export function uploadRecordSave(data) { // 保存
  return request({
    url: '/upload-record/save',
    method: 'put',
    data
  })
}

// --------------------------report列表-------------------------
export function exportInsert(data) { // 新增
  return request({
    url: '/report/insert',
    method: 'post',
    data
  })
}

export function exportList(params, path) { // 查询export列表
  return request({
    url: `/report/list/${path.page}/${path.limit}`,
    method: 'get',
    params
  })
}

// --------------------------menu 列表-------------------------
export function menuList(params, path) { // 查询menu列表
  return request({
    url: `/system/menu/list/${path.page}/${path.limit}`,
    method: 'get',
    params
  })
}

export function menuInsert(data) { // 新增
  return request({
    url: '/system/menu',
    method: 'post',
    data
  })
}

export function menuUpdate(data) { // 编辑
  return request({
    url: '/system/menu',
    method: 'put',
    data
  })
}

export function menuDelete(data, path) { // 删除
  return request({
    url: `/system/menu/${path.menuId}`,
    method: 'delete',
    data
  })
}

// --------------------------role 列表-------------------------
export function roleList(params, path) { // 查询role列表
  return request({
    url: `/system/role/list/${path.page}/${path.limit}`,
    method: 'get',
    params
  })
}

export function roleInsert(data) { // 新增
  return request({
    url: '/system/role',
    method: 'post',
    data
  })
}

export function roleUpdate(data) { // 编辑
  return request({
    url: '/system/role',
    method: 'put',
    data
  })
}

export function roleDelete(data, path) { // 删除
  return request({
    url: `/system/role/${path.roleId}`,
    method: 'delete',
    data
  })
}

// --------------------------user 列表-------------------------
export function userList(params, path) { // 查询user列表
  return request({
    url: `/system/user/list/${path.page}/${path.limit}`,
    method: 'get',
    params
  })
}

export function userInsert(data) { // 新增
  return request({
    url: '/system/user',
    method: 'post',
    data
  })
}

export function userUpdate(data) { // 编辑
  return request({
    url: '/system/user',
    method: 'put',
    data
  })
}

export function userDelete(data, path) { // 删除
  return request({
    url: `/system/user/${path.userId}`,
    method: 'delete',
    data
  })
}
