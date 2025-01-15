import { login, emailLogin, getUserMenuExtInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    permissionList: '',
    userInfo: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_PERMISSIONS: (state, permissionList) => {
    state.permissionList = permissionList
  },
  SET_USERINFO: (state, userInfo) => {
    state.userInfo = userInfo
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      // setToken(`Bearer 123456`)
      // setUser(userInfo.username)
      // resolve('/poStrategyDetail')
      login({
        username: username.trim(),
        password: password
      }).then(response => {
        if (response.code === 200) {
          commit('SET_TOKEN', `Bearer ${response.token}`)
          setToken(`Bearer ${response.token}`)
          resolve('/poStrategyDetail')
        } else {
          this.$message.error(response.msg)
        }
      }).catch(error => {
        reject(error)
      })
    })
  },
  // email login
  emailLogin({ commit }, userInfo) {
    const { userName, emailCode } = userInfo
    return new Promise((resolve, reject) => {
      emailLogin({
        username: userName,
        emailCode: emailCode
      }).then(response => {
        if (response.code === 200) {
          commit('SET_TOKEN', `Bearer ${response.token}`)
          setToken(`Bearer ${response.token}`)
          resolve('/vehicleMechanics')
        } else {
          this.$message.error(response.msg)
        }
      }).catch(error => {
        reject(error)
      })
    })
  },
  getRouter({ commit, state }) { // 获取路由
    return new Promise((resolve) => {
      if (localStorage.getItem('isRouter_AOP')) {
        commit('SET_PERMISSIONS', localStorage.getItem('isRouter_AOP'))
        resolve(JSON.parse(localStorage.getItem('isRouter_AOP')))
      } else {
        getUserMenuExtInfo().then(res => {
          if (res.data) {
            localStorage.setItem('isRouter_AOP', JSON.stringify(res.data))
            commit('SET_PERMISSIONS', res.data)
            resolve(res.data)
          }
        }).catch(() => {
          resolve()
        })
      }
    })
  },
  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      removeToken() // must remove  token  first
      resetRouter()
      commit('RESET_STATE')
      localStorage.removeItem('isRouter_AOP')
      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

