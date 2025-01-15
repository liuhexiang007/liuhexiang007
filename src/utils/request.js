import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: window._CONFIG.baseUrl, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 180000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = getToken()
    }
    config.headers['content-type'] = 'application/json;charset=utf-8'
    config.headers['platform'] = '0'
    config.headers['Access-Control-Allow-Origin'] = '*'
    config.headers['Access-Control-Allow-Methods'] = 'POST, GET, PUT, OPTIONS, DELETE'
    return config
  },
  error => {
    // do something with request error
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 200) {
      const msg = res.msg
      Message({
        message: msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error(msg || 'Error'))
    } else {
      return res
    }
  },
  error => {
    // for debug
    // 100001: Token expired;
    console.log(error)
    const errResponse = error.response
    if (errResponse && errResponse.code === 401) {
      // to re-login
      MessageBox.confirm('You are logged out, you can cancel your stay on this page, or log in again', 'Confirm cancellation', {
        confirmButtonText: 'Log back in',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      })
    } else {
      Message({
        message: error.msg,
        type: 'error',
        duration: 5 * 1000
      })
    }
    return Promise.reject(error)
  }
)

export default service
