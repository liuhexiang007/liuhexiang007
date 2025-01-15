import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_AOP_token'
const UserKey = 'vue_admin_AOP_user'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getUser() {
  return localStorage.getItem(UserKey)
}

export function setUser(token) {
  return localStorage.setItem(UserKey, token)
}

export function removeUser() {
  return localStorage.removeItem(UserKey)
}
