<template>
  <div>
    <el-dialog :title="title" :visible.sync="visible" width="30%">
      <div style="display: flex;justify-content: center">
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="120px">
          <el-form-item label="acceptance" prop="acceptance">
            <el-radio-group v-model="ruleForm.acceptance">
              <el-radio :label="'0'">not adopt</el-radio>
              <el-radio :label="'1'">adopt</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="comment" prop="comment">
            <el-input
              v-model="ruleForm.comment"
              style="width: 20vw"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
            />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="visible = false">Cancel</el-button>
        <el-button type="primary" :loading="loading" size="small" @click="makeSureAction">Save</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  feedbackInsert

} from '@/api/table'

export default {
  name: 'ExitDialog',
  data() {
    return {
      visible: false,
      title: '',
      material: '',
      type: '',
      loading: false,
      ruleForm: {
        acceptance: '1',
        comment: ''
      },
      rules: {
        comment: [
          { required: true, message: 'Please enter', trigger: 'blur' }
        ],
        acceptance: [
          { required: true, message: 'Please select', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    showDialog(record, type) {
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.resetFields()
      }
      this.ruleForm.id = ''
      this.title = 'Exit（Feedback & Print）'
      this.material = record
      this.type = type
      this.visible = true
      this.loading = false
    },
    makeSureAction() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.loading = true
          feedbackInsert({
            material: this.material,
            type: this.type,
            acceptance: this.ruleForm.acceptance,
            comment: this.ruleForm.comment
          }).then(res => {
            if (res.code === 200) {
              this.visible = false
              this.$message.success('Option success')
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
