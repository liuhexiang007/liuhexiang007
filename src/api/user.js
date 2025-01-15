import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function emailLogin(data) {
  return request({
    url: '/email-login',
    method: 'post',
    data
  })
}

export function getEmailCode(params) { // 获取邮箱验证码
  return request({
    url: `/email/sendCode`,
    method: 'get',
    params
  })
}

// --------------------------获取账户菜单-------------------------
export function getUserMenuExtInfo(params, path) { // 查询user列表
  return request({
    url: `/system/menu/list`,
    method: 'get',
    params
  })
}
