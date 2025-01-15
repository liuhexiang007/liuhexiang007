import axios from 'axios'
import { getToken } from '@/utils/auth'

export function uploadVerInfoProgress(data, progress) {
  const url = window._CONFIG.baseUrl + '/verInfo/uploadVerInfo'
  return new Promise(function(resolve, reject) {
    axios.post(url, data, {
      headers: {
        'Authorization': getToken(),
        'content-type': 'application/json;charset=utf-8',
        'Access-Control-Allow-Methods': 'POST, GET, PUT, OPTIONS, DELETE',
        'platform': '0',
        'Access-Control-Allow-Origin': '*'
      },
      onUploadProgress: progressEvent => {
        const complete = (progressEvent.loaded / progressEvent.total * 100 | 0)
        progress(complete)
      }
    }).then((response) => {
      resolve(response.data)
    })
  })
}

export function uploadExcelProgress(data, progress) {
  const url = window._CONFIG.baseUrl + '/editData/importByExcel'
  return new Promise(function(resolve) {
    axios.post(url, data, {
      headers: {
        'Authorization': getToken(),
        'content-type': 'application/json;charset=utf-8',
        'Access-Control-Allow-Methods': 'POST, GET, PUT, OPTIONS, DELETE',
        'platform': '0',
        'Access-Control-Allow-Origin': '*'
      },
      onUploadProgress: progressEvent => {
        const complete = (progressEvent.loaded / progressEvent.total * 100 | 0)
        progress(complete)
      }
    }).then((response) => {
      resolve(response.data)
    })
  })
}

export function changePasswordByToken(data, token) { // 修改密码单独带token
  const url = window._CONFIG.baseUrl + '/userInfo/changePassword'
  return new Promise(function(resolve, reject) {
    axios.post(url, data, {
      headers: {
        'Authorization': token,
        'content-type': 'application/json;charset=utf-8',
        'Access-Control-Allow-Methods': 'POST, GET, PUT, OPTIONS, DELETE',
        'platform': '0',
        'Access-Control-Allow-Origin': '*'
      }
    }).then((response) => {
      resolve(response.data)
    })
  })
}

// 下载mp4格式视频并重命名
export function downloadFileVideoRename(url, filename) {
  const xhr = new XMLHttpRequest()
  xhr.open('GET', url, true)
  xhr.responseType = 'arraybuffer' // 返回类型blob
  xhr.onload = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const blob = this.response
      // 转换一个blob链接
      const u = window.URL.createObjectURL(new Blob([blob], { type: 'video/mp4' }))
      const a = document.createElement('a')
      a.download = filename
      a.href = u
      a.style.display = 'none'
      document.body.appendChild(a)
      a.click()
      a.remove()
    }
  }
  xhr.send()
}

// 下载文件并重命名
export function downloadFileRename(url, filename) {
  const x = new XMLHttpRequest()
  x.open('GET', url, true)
  x.responseType = 'blob'
  x.onload = function() {
    // self.exportLoading = false;
    const url = window.URL.createObjectURL(x.response)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
  }
  x.send()
}

// downLoad文件
export function downLoadFile(url) {
  axios({
    method: 'get',
    url: url,
    responseType: 'document',
    headers: {
      'Authorization': getToken()
    }
  }).then(res => {
    if (res.code) {
      return
    }
    const now = new Date()
    const fileName = now.toLocaleTimeString() + 'VM'
    const blob = new Blob([res], {
      // 下载的文件格式自己在这边更改type的值就好了
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })
    if ('download' in document.createElement('a')) {
      const elink = document.createElement('a')
      elink.download = fileName
      elink.style.display = 'none'
      elink.href = URL.createObjectURL(blob)
      document.body.appendChild(elink)
      elink.click()
      URL.revokeObjectURL(elink.href)
      document.body.removeChild(elink)
    } else {
      navigator.msSaveBlob(blob, fileName)
    }
  })
}
