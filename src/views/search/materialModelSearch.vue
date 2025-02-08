<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div class="title"><span>Material to Model Search 按零件找車款</span></div>
      </div>
      <div class="searchBar">
        <div class="searchItem">
          <div class="item">
            <span>Part Number：</span>
            <!--            <el-input v-model="material" size="small" placeholder="Please enter P/N" />-->
            <el-select
              v-model="material"
              filterable
              remote
              :remote-method="remoteMethod"
              :loading="searchLoading"
              size="small"
              placeholder="Please select P/N"
            >
              <el-option
                v-for="item in materialList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div class="item">
            <span>Report Date：</span>
            <el-select
              v-model="reportDate"
              size="small"
              placeholder="Please select Report Date"
            >
              <el-option
                v-for="item in dateList"
                :key="item"
                :label="item+'/01'"
                :value="item"
              />
            </el-select>
          </div>
          <el-button size="small" @click="resetClick">Reset</el-button>
          <el-button type="primary" size="small" @click="searchClick">Search</el-button>
        </div>
      </div>
      <div style="display: flex;align-items: center;width: 100%;justify-content: space-between;margin-bottom: 10px">
        <span style="width: 100%;padding: 10px 0 10px 10px;background-color: rgb(211 211 211)">{{ description }}</span>
      </div>
      <span>Compatible list</span>
      <el-table
        v-loading="loading1"
        element-loading-text="Loading"
        element-loading-spinner="el-icon-loading"
        :data="tableData1"
        stripe
        height="60vh"
        style="width: 100%"
        border
        :header-cell-style="{backgroundColor: 'rgb(246, 248, 250)'}"
      >
        <el-table-column
          type="index"
          width="80"
          sortable
        />
        <el-table-column
          prop="manufacturer"
          label="Make/Manufacture"
          width="180"
          sortable
        />
        <el-table-column
          prop="modelNo"
          label="Model Type"
          width="150"
          sortable
        />
        <!-- <el-table-column
          prop="currentFleetSize"
          label="Fleet Size"
          width="180"
          sortable
        /> -->
        <el-table-column
          prop="fleetSize3"
          width="120"
          sortable
        >
          <template slot="header">
            <span>Fleet Size<br>Current year</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="fleetSize2"
          label="Fleet Size 1 year ago"
          width="96"
          sortable
        />
        <el-table-column
          prop="fleetSize1"
          label="Fleet Size 2 year ago"
          width="96"
          sortable
        />
        <el-table-column
          prop="fleetSize0"
          label="Fleet Size 3 year ago"
          width="96"
          sortable
        />
        <el-table-column
          prop="averageReplacePeriod"
          label="Average Replacement Period (Days)"
          width="175"
          sortable
        >
          <template slot-scope="scope">
            <span>{{ scope.row.averageReplacePeriod | formatNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="averageReplaceMileage"
          label="Average Replacement Mileage (km)"
          width="180"
          sortable
        >
          <template slot-scope="scope">
            <span>{{ scope.row.averageReplaceMileage | formatNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="consumptionPast3Months"
          label="Consumption in Past 3 Months"
          width="165"
          sortable
        />
        <el-table-column
          prop="consumptionPast6Months"
          label="Consumption in Past 6 Months"
          width="165"
          sortable
        />
        <el-table-column
          prop="consumptionPast12Months"
          label="Consumption in Past 12 Months"
          width="165"
          sortable
        />
      </el-table>
      <div style="display: flex;align-items: center;width: 100%;justify-content: flex-end">
        <div style="display: flex;flex-direction: column;margin-left: 10px;margin-top: 20px">
          <div style="margin-bottom: 20px">
            <el-button style="width: 120px" type="primary" size="small" @click="exportPlanClick">Export<br>Plan 導出表格</el-button>
            <el-button style="width: 130px" type="primary" size="small" @click="$refs.feedbackReportDialog.showDialog(material, 'B4')">Feedback<br>Feedback 用後報告</el-button>
            <el-button type="primary" size="small" @click="exitClick">Exit 離開及列印<br>（Feedback & Print）</el-button>
          </div>
        </div>
      </div>
    </el-card>
    <feedback-report-dialog ref="feedbackReportDialog" />
    <exit-dialog ref="exitDialog" />
  </div>
</template>

<script>
import moment from 'moment'
import {
  b4Search,
  // getTableDateList,
  getTableMaterialList
} from '@/api/table'
moment.locale('zh-cn')
import FeedbackReportDialog from '@/views/PO/module/feedbackReportDialog'
import ExitDialog from '@/views/PO/module/exitDialog'

export default {
  name: 'MaterialModelSearch',
  components: { ExitDialog, FeedbackReportDialog },
  data() {
    return {
      isBusy: false,
      material: '',
      materialList: '',
      dateList: [
        2023,
        2022
      ],
      reportDate: '',
      description: '',
      tableData1: [],
      tableData2: [],
      searchLoading: false,
      loading1: false,
      loading2: false
    }
  },
  created() {
    this.getMaterialList('')
    // this.getDateList()
  },
  methods: {
    resetClick() {
      this.material = ''
      this.partNumber = ''
      this.reportDate = ''
      this.getMaterialList('')
    },
    searchClick() { // 查询
      this.tableData = []
      this.getDataDetail()
    },
    remoteMethod(query) { // 下拉框远程搜索
      if (query !== '') {
        this.getMaterialList(query)
      }
    },
    getMaterialList(name) {
      this.searchLoading = true
      this.materialList = []
      getTableMaterialList({
        name: name
      }).then(res => {
        this.searchLoading = false
        if (res.data) {
          const list = []
          res.data.forEach(item => {
            const map = {
              label: item.name,
              value: item.name
            }
            list.push(map)
          })
          this.materialList = list
        }
      })
    },
    // getDateList() {
    //   this.dateList = []
    //   getTableDateList().then(res => {
    //     if (res.data) {
    //       const list = []
    //       res.data.forEach((item, index) => {
    //         const map = {
    //           label: item.date,
    //           value: index
    //         }
    //         list.push(map)
    //       })
    //       this.dateList = list
    //     }
    //   })
    // },
    getDataDetail() {
      this.loading1 = true
      b4Search({
        name: this.material,
        date: this.reportDate
      }).then(res => {
        this.loading1 = false
        if (res.data) {
          this.tableData1 = res.data
          if (res.data && res.data.length > 0) {
            this.description = res.data[0].description
          }
        }
      })
    },
    exportPlanClick() { // 导出表格
      if (this.material && this.material.length > 0) {
        let url = window._CONFIG.baseUrl + '/b4/export'
        url = url + '?name=' + this.material + '&date=' + this.reportDate
        if (url) {
          window.open(url)
        }
      } else {
        this.$message.error('Please select P/N')
      }
    },
    exitClick() {
      this.$refs.exitDialog.showDialog(this.material, 'B4')
    },
    showTime(time) { // 时间展示
      return moment(time).format('DD/MM/YYYY')
    },
    updateData() { // 更新数据
      this.currentPage = 1
      this.getDataDetail()
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
