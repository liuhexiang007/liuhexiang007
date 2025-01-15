<template>
  <div>
    <el-dialog :title="title" :visible.sync="visible" width="30%">
      <div style="display: flex;justify-content: center">
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="120px">
          <el-form-item label="Role Rank:" prop="roleSort">
            <el-input
              v-model="ruleForm.roleSort"
              size="small"
              maxlength="5"
              onkeyup="value=value.replace(/[^\d]/g,'')"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="Role Name:" prop="roleName">
            <el-input
              v-model="ruleForm.roleName"
              size="small"
              maxlength="20"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="Role Menu:" prop="menuIds">
            <el-button type="primary" size="small" @click="selectMenuClick">Select Menu</el-button>
            <!--            <el-select-->
            <!--              v-model="ruleForm.menuIds"-->
            <!--              multiple-->
            <!--              size="small"-->
            <!--              style="width:100%"-->
            <!--              placeholder="Please select menu type"-->
            <!--            >-->
            <!--              <el-option-->
            <!--                v-for="item in permissionList"-->
            <!--                :key="item.value"-->
            <!--                :label="item.label"-->
            <!--                :value="item.value"-->
            <!--              />-->
            <!--            </el-select>-->
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
        <el-button :disabled="isBusy" type="primary" size="small" @click="makeSureAction">Confirm</el-button>
      </div>
    </el-dialog>
    <assign-permissions-dialog ref="assignPermissionsDialog" @ok="selectBack" />
  </div>
</template>
<script>
import { menuList, roleInsert, roleUpdate } from '@/api/table'
import AssignPermissionsDialog from '@/views/account/modules/assignPermissionsDialog'

export default {
  name: 'AddRoleDialog',
  components: { AssignPermissionsDialog },
  data() {
    return {
      visible: false,
      isBusy: false,
      title: '',
      record: {},
      permissionList: [],
      isEdit: false,
      ruleForm: {
        roleSort: '',
        roleId: '',
        roleName: '',
        status: '0',
        menuIds: ''
      },
      rules: {
        roleSort: [
          { required: true, message: 'Please enter a role sort', trigger: 'blur' }
        ],
        roleName: [
          { required: true, message: 'Please enter a role name', trigger: 'blur' }
        ],
        menuIds: [
          { required: true, message: 'Please select the role menus', trigger: 'change' }
        ],
        status: [
          { required: true, message: 'Please select the role status', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    showDialog(record, isEdit) {
      this.getMenuList()
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.resetFields()
      }
      this.title = isEdit ? 'Edit Role' : 'Add Role'
      this.record = record
      this.isEdit = isEdit
      if (isEdit) {
        this.ruleForm.roleSort = record.roleSort
        this.ruleForm.roleId = record.roleId
        this.ruleForm.roleName = record.roleName
        this.ruleForm.status = record.status
        this.ruleForm.menuIds = record.menuIds
      } else {
        for (const key in this.ruleForm) {
          this.ruleForm[key] = ''
        }
        this.ruleForm.status = '0'
      }
      this.visible = true
      this.isBusy = false
    },
    getMenuList() {
      const path = {
        page: 0,
        limit: 500
      }
      menuList({}, path).then(res => {
        this.permissionList = []
        if (res.data) {
          const list = res.data.list
          const firstLevel = []
          list.forEach((item) => {
            const map = {
              label: item.menuName,
              value: item['menuId']
            }
            firstLevel.push(map)
          })
          this.permissionList = firstLevel
        }
      })
    },
    selectMenuClick() {
      const map = {
        selectKeys: this.ruleForm.menuIds
      }
      this.$refs.assignPermissionsDialog.showDialog(map)
    },
    selectBack(ids) {
      this.ruleForm.menuIds = ids
    },
    makeSureAction() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.isBusy) {
            this.$message.warning('Do not repeat operations during data submission!')
            return
          }
          this.isBusy = true
          if (this.isEdit) { // 编辑
            roleUpdate(this.ruleForm).then(res => {
              if (res.code === 200) {
                this.visible = false
                this.$message({
                  message: res.msg,
                  type: 'success'
                })
                this.$emit('ok')
              } else {
                this.$message.error(res.msg)
              }
              this.isBusy = false
            })
          } else { // 新增
            roleInsert(this.ruleForm).then(res => {
              if (res.code === 200) {
                this.visible = false
                this.$message({
                  message: res.msg,
                  type: 'success'
                })
                this.$emit('ok')
              } else {
                this.$message.error(res.msg)
              }
              this.isBusy = false
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
