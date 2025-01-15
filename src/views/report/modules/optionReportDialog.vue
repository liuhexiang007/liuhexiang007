<template>
  <div>
    <el-dialog :title="title" :visible.sync="visible" width="40%">
      <div style="display: flex;">
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="150px">
          <el-form-item label="Type:" prop="type">
            <el-select
              v-model="ruleForm.type"
              size="small"
              style="width:100%"
              placeholder="Please select type"
            >
              <el-option
                v-for="item in typeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="Start date:" prop="startDate">
            <el-date-picker
              v-model="ruleForm.startDate"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="Please select a start date"
            />
          </el-form-item>
          <el-form-item label="End date:" prop="endDate">
            <el-date-picker
              v-model="ruleForm.endDate"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="Please select a end date"
            />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="visible = false">Cancel</el-button>
        <el-button type="primary" :loading="loading" size="small" @click="makeSureAction">Sure</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { exportInsert } from '@/api/table'

export default {
  name: 'OptionReportDialog',
  data() {
    return {
      visible: false,
      title: '',
      record: {},
      isEdit: false,
      loading: false,
      typeList: [{
        label: 'VM',
        value: 'VM'
      }, {
        label: 'VMW',
        value: 'VMW'
      }],
      ruleForm: {
        id: '',
        type: '',
        startDate: '',
        endDate: ''
      },
      rules: {
        type: [
          { required: true, message: 'Please select type', trigger: 'change' }
        ],
        startDate: [
          { required: true, message: 'Please select a start date', trigger: 'change' }
        ],
        endDate: [
          { required: true, message: 'Please select a end date', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    showDialog(record) {
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.resetFields()
      }
      this.title = 'Insert'
      this.record = record
      for (const key in this.ruleForm) {
        this.ruleForm[key] = ''
      }
      this.visible = true
      this.loading = false
    },
    makeSureAction() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.loading = true
          exportInsert({
            type: this.ruleForm.type,
            startDate: this.ruleForm.startDate,
            endDate: this.ruleForm.endDate
          }
          ).then(res => {
            if (res.code === 200) {
              this.visible = false
              this.$message({
                message: res.msg,
                type: 'success'
              })
              this.$emit('ok')
            } else {
              this.progress = 0
              this.$message.error(res.msg)
            }
            this.loading = false
          })
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
