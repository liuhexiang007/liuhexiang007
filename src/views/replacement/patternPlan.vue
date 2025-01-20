<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div class="title">
          <span>Replacement pattern and plan 維修規律和預測</span>
        </div>
      </div>
      <div class="searchBar">
        <div class="searchItem">
          <div class="item">
            <span>Make：</span>
            <el-select
              v-model="makeValue"
              filterable
              remote
              :remote-method="makeRemoteMethod"
              :loading="makeSearchLoading"
              size="small"
              placeholder="Please select Make"
              @change="
                getModelList('');
                modelValue = '';
                getMaterialList('');
              "
            >
              <el-option
                v-for="item in makeList"
                :key="item.key"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div class="item">
            <span>Model：</span>
            <el-select
              v-model="modelValue"
              filterable
              remote
              :disabled="!makeValue || makeValue.length <= 0"
              :remote-method="modelRemoteMethod"
              :loading="modelSearchLoading"
              size="small"
              placeholder="Please select Model"
              @change="getMaterialList('')"
            >
              <el-option
                v-for="item in modelList"
                :key="item.key"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div class="item">
            <span>VSN：</span>
            <!--            <el-input v-model="material" size="small" placeholder="Please enter VSN" />-->
            <el-select
              v-model="material"
              filterable
              remote
              size="small"
              :remote-method="VSNRemoteMethod"
              :loading="VSNSearchLoading"
              placeholder="Please select VSN"
            >
              <el-option
                v-for="item in materialList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <!--          <div class="item">-->
          <!--            <span>Report Date：</span>-->
          <!--            <el-select-->
          <!--              v-model="reportDate"-->
          <!--              size="small"-->
          <!--              placeholder="Please select Report Date"-->
          <!--            >-->
          <!--              <el-option-->
          <!--                v-for="item in dateList"-->
          <!--                :key="item.value"-->
          <!--                :label="item.label"-->
          <!--                :value="item.label"-->
          <!--              />-->
          <!--            </el-select>-->
          <!--          </div>-->
          <el-button size="small" @click="resetClick">Reset</el-button>
          <el-button
            type="primary"
            size="small"
            @click="searchClick"
          >Search</el-button>
        </div>
      </div>
      <div
        style="
          display: flex;
          align-items: center;
          width: 100%;
          justify-content: space-between;
          margin-bottom: 10px;
        "
      >
        <span
          style="
            width: 100%;
            padding: 10px 0 10px 10px;
            background-color: rgb(211 211 211);
          "
        >
          Vehicle Type: {{ getDescriptionInfo.vehicleType }}, Make:
          {{ getDescriptionInfo.manufacturer }}, Model:
          {{ getDescriptionInfo.modelNo }}
        </span>
      </div>
      <span>Parts Replacement Prediction in next 12 months 預計下一次維修</span>
      <el-table
        v-loading="loading1"
        element-loading-text="Loading"
        element-loading-spinner="el-icon-loading"
        :data="tableData1"
        stripe
        height="38vh"
        style="width: 100%"
        border
        empty-text="No Prediction Results"
        :header-cell-style="{ backgroundColor: 'rgb(246, 248, 250)' }"
      >
        <el-table-column type="index" width="80" sortable />
        <el-table-column
          prop="partNumber"
          label="Part Number"
          min-width="220"
          sortable
        />
        <el-table-column
          prop="materialDescription"
          label="Description"
          min-width="130"
          sortable
        />
        <el-table-column prop="qty" label="Quantity" min-width="120" sortable>
          <template slot-scope="scope">
            <span>{{ scope.row.qty | formatNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="unit" label="Unit" min-width="120" sortable />
        <el-table-column
          prop="estimatedDate"
          label="Estimated Date"
          min-width="250"
          sortable
        >
          <template slot-scope="scope">
            <span>{{ showTime(scope.row.estimatedDate) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="estimatedMileage"
          label="Estimated Mileage (km)"
          min-width="250"
          sortable
        >
          <template slot-scope="scope">
            <span>{{ scope.row.estimatedMileage | formatNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="pm" label="PM" min-width="150" sortable />
        <el-table-column prop="cm" label="CM" min-width="150" sortable />
        <el-table-column prop="arsr" label="AR/SR" min-width="150" sortable />
      </el-table>
      <div style="margin-top: 10px">Last Replacement order</div>
      <div style="display: flex; align-items: center; width: 100%">
        <el-table
          v-loading="loading2"
          element-loading-text="Loading"
          element-loading-spinner="el-icon-loading"
          :data="tableData2"
          stripe
          height="30vh"
          style="width: 80%"
          border
          :header-cell-style="{ backgroundColor: 'rgb(246, 248, 250)' }"
        >
          <el-table-column type="index" min-width="80" sortable />
          <el-table-column
            prop="basicStartDate"
            label="Service Start Date"
            min-width="220"
            sortable
          >
            <template slot-scope="scope">
              <span>{{ showTime(scope.row.basicStartDate) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="partNumber"
            label="Material"
            min-width="150"
            sortable
          />
          <el-table-column
            prop="equipmentNumber"
            label="Part Number"
            min-width="150"
            sortable
          />
          <el-table-column
            prop="qtyinUnofEntry"
            label="Quantity"
            min-width="120"
            sortable
          >
            <template slot-scope="scope">
              <span>{{ scope.row.qtyinUnofEntry | formatNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="mileage"
            label="Mileage(km)"
            min-width="130"
            sortable
          >
            <template slot-scope="scope">
              <span>{{ scope.row.mileage | formatNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="currency"
            label="Currency"
            min-width="120"
            sortable
          />
          <el-table-column
            prop="historicalQty"
            label="Sum of Historical Quantity"
            min-width="250"
            sortable
          >
            <template slot-scope="scope">
              <span>{{ scope.row.historicalQty | formatNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="remark"
            label="Remark"
            min-width="100"
            sortable
          />
        </el-table>
        <div style="display: flex; flex-direction: column; margin-left: 10px">
          <div style="margin-bottom: 20px">
            <el-button
              style="width: 120px"
              type="primary"
              size="small"
              @click="exportPlanClick"
            >Export<br>Plan 導出表格</el-button>
            <el-button
              style="width: 130px"
              type="primary"
              size="small"
              @click="$refs.feedbackReportDialog.showDialog(material, 'C2')"
            >Report<br>Feedback用後報告</el-button>
          </div>
          <el-button
            type="primary"
            size="small"
            @click="exitClick"
          >Exit 離開及列印<br>（Feedback & Print）</el-button>
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
  c2Makes,
  c2Models,
  c2Search,
  getTableDateList,
  vsnList
} from '@/api/table'
moment.locale('zh-cn')
import FeedbackReportDialog from '@/views/PO/module/feedbackReportDialog'
import ExitDialog from '@/views/PO/module/exitDialog'

export default {
  name: 'PatternPlan',
  components: { ExitDialog, FeedbackReportDialog },
  data() {
    return {
      isBusy: false,
      makeSearchLoading: false,
      makeList: [],
      makeValue: '',
      modelSearchLoading: false,
      modelList: [],
      modelValue: '',
      VSNSearchLoading: false,
      material: '',
      materialList: '',
      dateList: '',
      reportDate: '',
      description: {
        vehicleType: '',
        manufacturer: '',
        modelNo: ''
      },
      tableData1: [],
      tableData2: [],
      loading1: false,
      loading2: false
    }
  },
  computed: {
    getDescriptionInfo() {
      return {
        vehicleType: this.description?.vehicleType || '-',
        manufacturer: this.description?.manufacturer || '-',
        modelNo: this.description?.modelNo || '-'
      }
    }
  },
  created() {
    this.getMaterialList('')
    this.getMakeList()
  },
  methods: {
    resetClick() {
      this.partNumber = ''
      this.reportDate = ''
    },
    searchClick() {
      // 查询
      this.tableData1 = []
      this.tableData2 = []
      this.getDataDetail()
      console.log(this.tableData1, 'dadaadatata')
    },
    makeRemoteMethod(query) {
      // make下拉搜索
      if (query !== '') {
        this.getMakeList(query)
      }
    },
    modelRemoteMethod(query) {
      // model下拉搜索
      if (query !== '') {
        this.getModelList(query)
      }
    },
    VSNRemoteMethod(query) {
      // VSN下拉搜索
      if (query !== '') {
        this.getMaterialList(query)
      }
    },
    getMakeList(name) {
      // 获取make
      this.makeSearchLoading = true
      c2Makes({
        name: name
      }).then((res) => {
        this.makeSearchLoading = false
        if (res.data) {
          const list = []
          res.data.forEach((item) => {
            const map = {
              label: item,
              value: item
            }
            list.push(map)
          })
          this.makeList = list
        }
      })
    },
    getModelList(name) {
      // 获取model
      this.modelSearchLoading = true
      c2Models({
        make: this.makeValue,
        name: name
      }).then((res) => {
        this.modelSearchLoading = false
        if (res.data) {
          const list = []
          res.data.forEach((item) => {
            const map = {
              label: item,
              value: item
            }
            list.push(map)
          })
          this.modelList = list
        }
      })
    },
    getMaterialList(name) {
      this.materialList = []
      this.VSNSearchLoading = true
      vsnList({
        make: this.makeValue,
        model: this.modelValue,
        name: name
      }).then((res) => {
        this.VSNSearchLoading = false
        if (res.data) {
          const list = []
          res.data.forEach((item) => {
            const map = {
              label: item,
              value: item
            }
            list.push(map)
          })
          this.materialList = list
        }
      })
    },
    getDateList() {
      this.dateList = []
      getTableDateList().then((res) => {
        if (res.data) {
          const list = []
          res.data.forEach((item, index) => {
            const map = {
              label: item.date,
              value: index
            }
            list.push(map)
          })
          this.dateList = list
        }
      })
    },
    getDataDetail() {
      this.loading1 = true
      this.loading2 = true
      c2Search({
        name: this.material
        // date: this.reportDate
      }).then((res) => {
        this.loading2 = false
        this.loading1 = false
        if (res.data) {
          // 打印第一条数据看看结构
          console.log('First record:', res.data.maintenancePrediction[0])

          try {
            // 找到包含 description 的记录
            const item = res.data.maintenancePrediction.find(
              (record) =>
                record.description &&
                record.description.vehicleType &&
                record.description.manufacturer &&
                record.description.modelNo
            )

            if (item) {
              this.description = {
                vehicleType: item.description.vehicleType,
                manufacturer: item.description.manufacturer,
                modelNo: item.description.modelNo
              }
            }
            console.log('Updated description:', this.description)
          } catch (error) {
            console.error('Error updating description:', error)
            this.description = {
              vehicleType: '',
              manufacturer: '',
              modelNo: ''
            }
          }
        }
        this.tableData1 = res.data.maintenancePrediction || []
        this.tableData2 = res.data.maintenanceHistory || []
      })
    },
    exportPlanClick() {
      // 导出表格
      if (this.material && this.material.length > 0) {
        let url = window._CONFIG.baseUrl + '/c2/export'
        url = url + '?name=' + this.material
        if (url) {
          window.open(url)
        }
      } else {
        this.$message.error('Please select VSN')
      }
    },
    exitClick() {
      this.$refs.exitDialog.showDialog(this.material, 'C2')
    },
    showTime(time) {
      // 时间展示
      return moment(time).format('DD/MM/YYYY')
    },
    updateData() {
      // 更新数据
      this.currentPage = 1
      this.getDataDetail()
    }
  }
}
</script>

<style lang="less" scoped>
.el-input {
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
  clear: both;
}
.clearfix {
  border-bottom: 1px solid #d3eae0;
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
  padding: 0 !important;
}
#tabItemOptionDialog {
  position: absolute;
  z-index: 999;
}
.isfixed {
  opacity: 0;
}
.el-table th.el-table__cell:hover .isfixed {
  opacity: 1;
  cursor: pointer;
  float: right;
  color: #1d703e;
}
.el-table th.el-table__cell.is-sortable:hover .isfixed {
  opacity: 1;
  cursor: pointer;
  float: right;
  color: #1d703e;
  margin-top: 6px;
}
/deep/.el-table .caret-wrapper {
  opacity: 0;
}
/deep/.el-table th.el-table__cell.is-sortable:hover .caret-wrapper {
  opacity: 1;
}
/deep/.el-table th.el-table__cell > .cell {
  word-break: break-word;
}
</style>
