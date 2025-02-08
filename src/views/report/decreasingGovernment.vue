<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div class="title"><span>Report on Decreasing Model in Government Fleet 車款減少報告</span></div>
      </div>
      <div class="searchBar">
        <div class="searchItem">
          <div class="item">
            <span>Decrease % threshold：</span>
            <el-slider v-model="sliderValue" style="width: 250px;margin-right: 10px" :max="100" :min="0" :step="5" />
            <span>{{ sliderValue }}</span>
          </div>
          <el-button type="primary" size="small" :loading="updateLoading" @click="upDateClick">Update Parameter</el-button>
          <el-button type="primary" size="small" @click="searchClick">Generate Report</el-button>
        </div>
      </div>
      <el-table
        v-loading="loading"
        element-loading-text="Loading"
        element-loading-spinner="el-icon-loading"
        :data="tableData"
        stripe
        height="68vh"
        style="width: 100%"
        border
        :header-cell-style="{backgroundColor: 'rgb(246, 248, 250)'}"
      >
        <el-table-column
          type="index"
          min-width="50"
          fixed
        />
        <el-table-column
          prop="reportName"
          label="Report Name"
          min-width="250"
        />
        <el-table-column
          prop="createTime"
          label="Created On"
          min-width="300"
        >
          <template slot-scope="scope">
            <span>{{ showTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="Action"
          min-width="150"
          fixed="right"
        >
          <template slot-scope="scope">
            <!--            <a>View</a>-->
            <a @click="exportClick(scope.row)">Download</a>
          </template>
        </el-table-column>
      </el-table>
      <div style="display: flex;justify-content: flex-end;margin-top: 20px">
        <el-pagination
          :current-page.sync="currentPage"
          :page-size="10"
          layout="prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
import moment from 'moment'
import { c1List, c1Update } from '@/api/table'
moment.locale('zh-cn')

export default {
  name: 'DecreasingGovernment',
  components: { },
  data() {
    return {
      updateLoading: false,
      value1: [],
      fileName: '',
      tableData: [],
      currentPage: 1,
      total: 0,
      loading: false,
      sliderValue: 10
    }
  },
  created() {
    this.getReportDataList()
  },
  methods: {
    searchClick() { // 查询
      this.currentPage = 1
      this.getReportDataList()
    },
    upDateClick() { // 更新
      this.updateLoading = true
      c1Update({
        threshold: String((this.sliderValue / 100))
      }).then(res => {
        this.updateLoading = false
        if (res.code === 200) {
          this.$message.success(res.msg)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleSizeChange(val) { // 每页条数变化
    },
    handleCurrentChange(val) { // 当前页数切换
      this.currentPage = val
      this.getReportDataList()
    },
    addClick() {
      this.$refs.optionReportDialog.showDialog({})
    },
    getReportDataList() {
      const path = {
        page: this.currentPage - 1,
        limit: 10
      }
      this.loading = true
      c1List({}, path).then(res => {
        this.loading = false
        if (res.data) {
          this.total = res.data.total
          this.tableData = res.data.list
        }
      })
    },
    showTime(time) { // 时间展示
      return moment(time).format('YYYY-MM-DD HH:mm:ss')
    },
    exportClick(data) { // 自定义导出
      if (data.id) {
        const url = window._CONFIG.baseUrl + '/c1/export/' + data.id
        console.log('export url:', url)
        console.log('export headers:', document.cookie) // 查看是否有 cookie
        if (url) {
          window.open(url)
        }
      }
    },
    updateData() { // 更新数据
      this.currentPage = 1
      this.getReportDataList()
    }
  }
}
</script>

<style lang="less" scoped>
.el-input{
  width: 250px;
}
.searchBar {
  display: flex;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 10px;
  justify-content: space-between;
  .searchItem {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    .item {
      display: flex;
      align-items: center;
      margin-right: 10px;
      span {
        white-space: nowrap;
        font-size: 14px;
      }
    }
  }
  .buttonItem {
    display: flex;
    align-items: center;
    button {
      margin-left: 10px;
    }
  }
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}
.clearfix {
  border-bottom: 1px solid #D3EAE0;
}

.box-card {
  .title {
    height: 55px;
    display: flex;
    align-items: center;
    span {
      color: black;
      font-weight: bold;
      font-family: "Microsoft Yahei", Arial, sans-serif;
      font-size: 20px;
      text-indent: 20px;
    }
  }
  .cell {
    a {
      margin-right: 10px;
    }
  }
}
/deep/.el-card__header {
  padding: 0!important;
}
#tabItemOptionDialog {
  position: absolute;
  z-index: 999;
}
.isfixed {
  opacity: 0;
}
.el-table th.el-table__cell:hover .isfixed{
  opacity: 1;
  cursor: pointer;
  float: right;
  color: #1D703E;
}
.el-table th.el-table__cell.is-sortable:hover .isfixed{
  opacity: 1;
  cursor: pointer;
  float: right;
  color: #1D703E;
  margin-top: 6px;
}
/deep/.el-table .caret-wrapper {
  opacity: 0;
}
/deep/.el-table th.el-table__cell.is-sortable:hover .caret-wrapper{
  opacity: 1;
}
</style>
