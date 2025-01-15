<template>
  <div>
    <el-dialog :title="title" :visible.sync="visible" width="30%">
      <div style="display: flex;justify-content: center">
        <el-form ref="ruleForm" :model="ruleForm" status-icon :rules="rules" label-width="150px" class="demo-ruleForm">
          <el-form-item :label="$t('resetPasswordDialog.userName')" prop="oldPass">
            <el-input v-model="ruleForm.userName" size="small" disabled />
          </el-form-item>
          <el-form-item :label="$t('resetPasswordDialog.oldPassword')" prop="oldPass">
            <el-input v-model="ruleForm.oldPass" size="small" show-password autocomplete="off" />
          </el-form-item>
          <el-form-item :label="$t('resetPasswordDialog.newPassword')" prop="pass">
            <el-input v-model="ruleForm.pass" size="small" show-password autocomplete="off" />
          </el-form-item>
          <el-form-item :label="$t('resetPasswordDialog.markSure')" prop="checkPass">
            <el-input v-model="ruleForm.checkPass" size="small" show-password autocomplete="off" maxlength="16" show-word-limit />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm()">{{ $t('resetPasswordDialog.commit') }}</el-button>
            <el-button @click="resetForm()">{{ $t('resetPasswordDialog.reset') }}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>
<script>

import { changePasswordByToken } from '@/api/progress'
import { getToken } from '@/utils/auth'

export default {
  name: 'ResetPasswordDialog',
  data() {
    const _self = this
    const validateOldPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(_self.$t('resetPasswordDialog.passwordMessage1')))
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{9,16}$/
      if (value === '') {
        callback(new Error(_self.$t('resetPasswordDialog.passwordMessage2')))
      } else if (!reg.test(value)) {
        callback(new Error(_self.$t('resetPasswordDialog.passwordMessage5')))
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(_self.$t('resetPasswordDialog.passwordMessage3')))
      } else if (value !== this.ruleForm.pass) {
        callback(new Error(_self.$t('resetPasswordDialog.passwordMessage4')))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      title: '',
      token: '',
      ruleForm: {
        userName: '',
        oldPass: '',
        pass: '',
        checkPass: ''
      },
      rules: {
        oldPass: [
          { required: true, validator: validateOldPass, trigger: 'blur' }
        ],
        pass: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { required: true, validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    showDialog(record, token) {
      if (token) {
        this.token = token
      } else {
        this.token = getToken()
      }
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.resetFields()
        for (const key in this.ruleForm) {
          this.ruleForm[key] = ''
        }
      }
      this.ruleForm.userName = record.loginName
      this.title = this.$t('resetPasswordDialog.title')
      this.visible = true
    },
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          changePasswordByToken({
            loginPwd: this.$md5(this.ruleForm.oldPass),
            newPassword: this.$md5(this.ruleForm.pass)
          }, this.token).then(res => {
            if (res.status === 200) {
              this.$message.success('修改密码成功, 请重新登录')
              this.visible = false
              this.logOut()
            } else {
              this.$message.error(res.message)
            }
          })
        } else {
          return false
        }
      })
    },
    async logOut() { // 退出登录
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    resetForm() {
      this.$refs.ruleForm.resetFields()
    }
  }
}
</script>

<style scoped>

</style>
