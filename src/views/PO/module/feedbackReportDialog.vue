<template>
  <div>
    <el-dialog :title="title" :visible.sync="visible" width="60%">
      <el-card class="box-card">
        <el-table
          v-loading="loading"
          element-loading-text="Loading"
          element-loading-spinner="el-icon-loading"
          :data="tableData"
          stripe
          height="40vh"
          style="width: 100%;margin-top: 20px"
          border
          :header-cell-style="{backgroundColor: 'rgb(246, 248, 250)'}"
        >
          <el-table-column
            type="index"
            width="50"
          />
          <el-table-column
            prop="date"
            label="Prediction Date"
          />
          <el-table-column
            prop="acceptance"
            label="User Acceptance"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.acceptance">Adopted</span>
              <span v-else>Not Adopted</span>
              <!--              <el-switch v-model="scope.row.acceptance" @change="switchChange(scope.row)"></el-switch>-->
            </template>
          </el-table-column>
          <el-table-column
            prop="comment"
            label="User Comment"
          />
        </el-table>
        <!--        <div style="display: flex;justify-content: flex-end;margin-top: 20px">-->
        <!--          <el-pagination-->
        <!--            :current-page.sync="currentPage"-->
        <!--            :page-size="pageSize"-->
        <!--            :page-sizes="[10, 50, 100, 200]"-->
        <!--            layout="total, sizes, prev, pager, next, jumper"-->
        <!--            :total="total"-->
        <!--            @size-change="handleSizeChange"-->
        <!--            @current-change="handleCurrentChange"-->
        <!--          />-->
        <!--        </div>-->
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="exportClick">Save</el-button>
        <el-button type="primary" :loading="loading" size="small">Print</el-button>
        <el-button size="small" @click="visible = false">Close</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { feedbackList } from '@/api/table'
import moment from 'moment'
moment.locale('zh-cn')
export default {
  name: 'FeedbackReportDialog',
  components: {},
  data() {
    return {
      visible: false,
      title: '',
      loading: false,
      total: 0,
      material: '',
      type: '',
      tableData: [],
      currentPage: 1,
      pageSize: 50
    }
  },
  methods: {
    showDialog(material, type) {
      this.title = 'Report Feedback用後報告'
      this.material = material
      this.type = type
      this.getDataList()
      this.visible = true
      this.loading = false
    },
    handleSizeChange(val) { // 每页条数变化
      this.pageSize = val
      this.getDataList()
    },
    handleCurrentChange(val) { // 当前页数切换
      this.currentPage = val
      this.getDataList()
    },
    switchChange(item) {
    },
    getDataList() {
      this.loading = false
      feedbackList({
        material: this.material,
        type: this.type
      }).then(res => {
        this.loading = false
        this.tableData = []
        if (res.data) {
          // res.data.forEach(item => {
          //   item.acceptance = item.acceptance === 1
          // })
          // console.log(res.data)
          this.tableData = res.data
        }
      })
    },
    exportClick() { // 自定义导出
      let url = window._CONFIG.baseUrl + '/feedback/list/export'
      url = url + '?material=' + this.material
      if (url) {
        window.open(url)
      }
    },
    showTime(time) { // 时间展示
      if (!time) {
        return ''
      }
      return moment(time).format('YYYY-MM-DD HH:mm:ss')
    }
  }
}
</script>

<style lang="less" scoped>
.el-input,.el-select{
  width: 280px;
}
.buttonItem {
  display: flex;
  align-items: center;
  button {
    margin: 10px;
  }
}
.box-card {
  // margin: 0 20px 20px 20px;
  // .title {
  //   height: 55px;
  //   display: flex;
  //   align-items: center;
  //   span {
  //     color: #000000;
  //     font-weight: bold;
  //     font-family: "Microsoft Yahei", Arial, sans-serif;
  //     font-size: 20px;
  //     text-indent: 20px;
  //   }
  // }
  .cell {
    a {
      margin-right: 10px;
      color: #1890FF
    }
  }
}
</style>
