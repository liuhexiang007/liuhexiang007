<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div class="title"><span>Report Center</span></div>
      </div>
      <div class="searchBar">
        <div class="searchItem">
          <div class="item">
            <span>Search：</span>
            <el-input
              v-model="fileName"
              size="small"
              placeholder="Enter Text"
            >
              <i slot="prefix" class="el-input__icon el-icon-search" />
            </el-input>
          </div>
          <el-button type="primary" size="small" @click="searchClick">Search</el-button>
        </div>
        <div class="buttonItem">
          <el-button type="primary" size="small" @click="addClick">+ New</el-button>
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
          prop="id"
          label="ID"
          min-width="250"
        />
        <el-table-column
          prop="name"
          label="Report Name"
          min-width="250"
        />
        <el-table-column
          prop="type"
          label="Type"
        />
        <el-table-column
          prop="createTime"
          label="Create Date"
          min-width="300"
        >
          <template slot-scope="scope">
            <span>{{ showTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="startDate"
          label="Start Date"
          min-width="300"
        >
          <template slot-scope="scope">
            <span>{{ showTime(scope.row.startDate) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="endDate"
          label="End Date"
          min-width="300"
        >
          <template slot-scope="scope">
            <span>{{ showTime(scope.row.endDate) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="Action"
          min-width="150"
          fixed="right"
        >
          <template slot-scope="scope">
            <a @click="exportClick(scope.row)">Export</a>
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
    <option-report-dialog ref="optionReportDialog" @ok="updateData" />
  </div>
</template>

<script>
import moment from 'moment'
import { exportList } from '@/api/table'
import OptionReportDialog from '@/views/report/modules/optionReportDialog'
moment.locale('zh-cn')

export default {
  name: 'ReportCenter',
  components: { OptionReportDialog },
  data() {
    return {
      value1: [],
      fileName: '',
      tableData: [],
      currentPage: 1,
      total: 0,
      loading: false
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
      exportList({}, path).then(res => {
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
        const url = window._CONFIG.baseUrl + '/report/export/' + data.id
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
