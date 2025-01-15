const AvatarKey = 'vue_admin_template_avatar'
const BatchNoKey = 'vue_admin_template_batch'

export function getAvatar() {
  return localStorage.getItem(AvatarKey)
}

export function setAvatar(avatar) {
  return localStorage.setItem(AvatarKey, avatar)
}

export function removeAvatar() {
  return localStorage.removeItem(AvatarKey)
}

// 当前启动批次号保存
export function getBatchNo() {
  return localStorage.getItem(BatchNoKey)
}

export function setBatchNo(batchNo) {
  return localStorage.setItem(BatchNoKey, batchNo)
}

export function removeBatchNo() {
  return localStorage.removeItem(BatchNoKey)
}
