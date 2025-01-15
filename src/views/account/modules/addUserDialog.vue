<template>
  <div>
    <el-dialog :title="title" :visible.sync="visible" width="35%">
      <div style="display: flex;justify-content: center;width: 100%">
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="130px" style="width: 80%">
          <el-form-item label="User Name:" prop="userName">
            <el-input
              v-model="ruleForm.userName"
              size="small"
              maxlength="20"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="Nick Name:" prop="nickName">
            <el-input
              v-model="ruleForm.nickName"
              size="small"
              maxlength="10"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="Password:" prop="password">
            <el-input
              v-model="ruleForm.password"
              size="small"
              maxlength="15"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="User Role:" prop="roleIds">
            <el-select
              v-model="ruleForm.roleIds"
              multiple
              size="small"
              style="width:100%"
              placeholder="Please select roles"
            >
              <el-option
                v-for="item in roleList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <!--          <el-form-item label="Phone Number:" prop="phonenumber">-->
          <!--            <el-input-->
          <!--              v-model="ruleForm.phonenumber"-->
          <!--              size="small"-->
          <!--              onkeyup="value=value.replace(/[^\d]/g,'')"-->
          <!--              maxlength="11"-->
          <!--              show-word-limit-->
          <!--            />-->
          <!--          </el-form-item>-->
          <el-form-item label="Email:" prop="email">
            <el-input
              v-model="ruleForm.email"
              size="small"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="Role status:" prop="status">
            <el-radio-group v-model="ruleForm.status">
              <el-radio :label="'0'">Enable</el-radio>
              <el-radio :label="'1'">Disable</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="visible = false">Cancel</el-button>
        <el-button type="primary" :loading="loading" size="small" @click="makeSureAction">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { roleList, userInsert, userUpdate } from '@/api/table'
export default {
  name: 'AddUserDialog',
  data() {
    const validatePass = (rule, value, callback) => {
      const reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      if (value === '') {
        callback(new Error('Please enter password'))
      } else if (!reg.test(value)) {
        callback(new Error('The value must contain 8 or more characters and contain uppercase, lowercase, special characters, and digits'))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      title: '',
      record: {},
      isEdit: false,
      roleList: [],
      loading: false,
      ruleForm: {
        userId: '',
        nickName: '',
        userName: '',
        password: '',
        // phonenumber: '',
        email: '',
        status: '',
        roleIds: ''
      },
      rules: {
        userName: [
          { required: true, message: 'Please enter your username', trigger: 'blur' }
        ],
        nickName: [
          { required: true, message: 'Please enter a user nickname', trigger: 'blur' }
        ],
        password: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        // phonenumber: [
        //   { required: true, message: 'Please enter your phone number', trigger: 'blur' }
        // ],
        email: [
          { required: true, message: 'Please enter email', trigger: 'blur' }
        ],
        status: [
          { required: true, message: 'Please select the user status', trigger: 'change' }
        ],
        roleIds: [
          { required: true, message: 'Please enter a roles', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    showDialog(record, isEdit) {
      this.getRoleList()
      this.$nextTick(() => {
        if (this.$refs.ruleForm) {
          this.$refs.ruleForm.resetFields()
        }
        if (isEdit) {
          this.ruleForm.userId = record.userId
          this.ruleForm.userName = record.userName
          this.ruleForm.nickName = record.nickName
          this.ruleForm.roleIds = record.roleIds
          // this.ruleForm.phonenumber = record.phonenumber
          this.ruleForm.email = record.email
          this.ruleForm.status = record.status
          this.ruleForm.password = ''
        } else {
          for (const key in this.ruleForm) {
            this.ruleForm[key] = ''
          }
          this.ruleForm.status = '0'
        }
      })
      this.title = isEdit ? 'Edit User' : 'Add User'
      this.record = record
      this.isEdit = isEdit
      this.visible = true
      this.loading = false
    },
    getRoleList() { // 获取角色列表
      const path = {
        page: 0,
        limit: 500
      }
      roleList({}, path).then(res => {
        if (res.data) {
          const list = res.data.list
          const firstLevel = []
          list.forEach((item) => {
            const map = {
              label: item.roleName,
              value: item.roleId
            }
            firstLevel.push(map)
          })
          this.roleList = firstLevel
        }
      })
    },
    makeSureAction() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.isEdit) { // 编辑
            userUpdate(this.ruleForm).then(res => {
              if (res.code) {
                this.visible = false
                this.$emit('ok')
              }
              this.loading = false
            }).catch(() => {
              this.loading = false
            })
          } else { // 新增
            userInsert(this.ruleForm).then(res => {
              if (res.code) {
                this.visible = false
                this.$emit('ok')
              }
              this.loading = false
            }).catch(() => {
              this.loading = false
            })
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
