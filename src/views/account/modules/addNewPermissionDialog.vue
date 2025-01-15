<template>
  <div>
    <el-dialog :title="title" :visible.sync="visible" width="30%">
      <div style="display: flex;justify-content: center">
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="120px">
          <el-form-item label="Sort:" prop="orderNum">
            <el-input
              v-model="ruleForm.orderNum"
              size="small"
              maxlength="5"
              onkeyup="value=value.replace(/[^\d]/g,'')"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="Menu Name:" prop="menuName">
            <el-input
              v-model="ruleForm.menuName"
              size="small"
              maxlength="50"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="Menu type:" prop="menuType">
            <el-select
              v-model="ruleForm.menuType"
              size="small"
              style="width:100%"
              placeholder="Please select menu type"
            >
              <el-option
                v-for="item in typeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="Menu path:" prop="path">
            <el-input
              v-model="ruleForm.path"
              size="small"
              maxlength="50"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="Menu Label:" prop="component">
            <el-input
              v-model="ruleForm.component"
              size="small"
              maxlength="50"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="Hidden menu:" prop="visible">
            <el-radio-group v-model="ruleForm.visible">
              <el-radio :label="'1'">Yes</el-radio>
              <el-radio :label="'0'">No</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="Menu icon:" prop="icon">
            <el-input
              v-model="ruleForm.icon"
              size="small"
              maxlength="30"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="Remark:" prop="remark">
            <el-input
              v-model="ruleForm.remark"
              type="textarea"
              size="small"
              maxlength="200"
              show-word-limit
            />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="visible = false">Cancel</el-button>
        <el-button :disabled="isBusy" type="primary" size="small" @click="makeSureAction">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import { menuInsert, menuUpdate } from '@/api/table'

export default {
  name: 'AddNewPermissionDialog',
  data() {
    return {
      visible: false,
      isBusy: false,
      title: '',
      record: '',
      type: '',
      isEdit: false,
      typeList: [{
        label: 'Catalog',
        value: 'M'
      }, {
        label: 'Menu',
        value: 'C'
      }, {
        label: 'Button',
        value: 'F'
      }],
      ruleForm: {
        menuId: '',
        orderNum: '',
        menuName: '',
        path: '',
        component: '',
        menuType: '',
        parentId: '',
        parentName: '',
        query: '0',
        isFrame: '0',
        isCache: '0',
        visible: '',
        status: '0',
        icon: '',
        remark: ''
      },
      rules: {
        orderNum: [
          { required: true, message: 'Please enter the sort number', trigger: 'blur' }
        ],
        menuName: [
          { required: true, message: 'Please enter a menu name', trigger: 'blur' }
        ],
        menuType: [
          { required: true, message: 'Please enter a menu type', trigger: 'change' }
        ],
        path: [
          { required: true, message: 'Please enter the menu label', trigger: 'blur' }
        ],
        component: [
          { required: true, message: 'Please enter the menu label', trigger: 'blur' }
        ],
        visible: [
          { required: true, message: 'Please select whether the menu is hidden', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    showDialog(record, isEdit, type) {
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.resetFields()
      }
      this.title = isEdit ? 'Edit menu' : 'New menu'
      this.record = record
      this.type = type
      this.isEdit = isEdit
      if (isEdit) {
        for (const key in this.ruleForm) {
          this.ruleForm[key] = record[key]
        }
      } else {
        for (const key in this.ruleForm) {
          this.ruleForm[key] = ''
        }
        this.ruleForm.parentId = record['menuId']
        this.ruleForm.parentName = record['menuName']
        this.ruleForm.visible = '0'
      }
      this.isBusy = false
      this.visible = true
    },
    makeSureAction() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.isBusy) {
            this.$message.warning('Do not repeat operations during data submission')
            return
          }
          this.isBusy = true
          if (this.isEdit) { // 编辑
            menuUpdate(this.ruleForm).then(res => {
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
            }).catch(() => {
              this.isBusy = false
            })
          } else { // 新增
            menuInsert(this.ruleForm).then(res => {
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
            }).catch(() => {
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
