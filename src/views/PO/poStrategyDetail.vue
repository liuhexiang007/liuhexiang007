<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div class="title"><span>PO Strategy Detail 採購策略</span></div>
      </div>
      <div class="searchBar">
        <div class="searchItem">
          <div class="item">
            <span>Part Number 零件號碼：</span>
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
                :key="item.key"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div class="item">
            <span>Report Date 報表日期：</span>
            <el-select
              v-model="reportDate"
              size="small"
              placeholder="Please select Report Date"
            >
              <el-option
                v-for="item in dateList"
                :key="item.value"
                :label="item.label"
                :value="item.label"
              />
            </el-select>
          </div>
          <el-button size="small" @click="resetClick">Reset</el-button>
          <el-button
            type="primary"
            size="small"
            @click="searchClick"
          >Search</el-button>
        </div>
        <!-- 右侧控件组 -->
        <div style="width: 35%; display: flex; flex-direction: column">
          <!-- Cost Limiter控制组 -->
          <div
            style="
              display: flex;
              align-items: center;
              margin-bottom: 4px;
              justify-content: space-between;
            "
          >
            <span style="margin-right: 4px; font-size: 12px">Cost Limiter</span>
            <el-switch
              v-model="costLimiterEnabled"
              style="margin: 0 8px"
              active-text="On"
              inactive-text="Off"
              active-color="#409EFF"
              inactive-color="#ff4949"
              @change="handleSwitchChange"
            />
            <span style="margin: 0 8px; font-size: 12px">Cost Limit</span>
            <el-input
              v-model="costLimitValue"
              :disabled="!costLimiterEnabled"
              :class="{ 'invalid-input': isInvalidValue }"
              placeholder="e.g. 50K"
              size="small"
              style="width: 130px; margin: 0 8px"
              @input="handleCostLimitInput"
            >
              <!-- 添加错误提示 -->

            </el-input>
            <el-button
              size="mini"
              style="padding: 4px 6px; margin: 0 4px"
              :disabled="!costLimiterEnabled"
              @click="resetCostLimit"
            >Reset</el-button>
            <!-- <el-button
              type="primary"
              size="mini"
              style="padding: 4px 6px; margin-left: 4px"
              :disabled="!costLimiterEnabled || isBusy"
              @click="updateCostLimit"
            >Update</el-button> -->
          </div>
          <!-- 滑块组件 -->
          <div style="width: 100%">
            <div
              style="
                width: 100%;
                display: flex;
                justify-content: space-between;
                margin-bottom: 2px;
              "
            >
              <span
                style="width: 21%; color: #909399; font-size: 12px"
              >{{ formattedScaleMarks[0] }}</span>
              <span
                style="width: 19%; color: #909399; font-size: 12px"
              >{{ formattedScaleMarks[1] }}</span>
              <span
                style="
                  width: 20%;
                  color: #909399;
                  font-size: 12px;
                  text-align: center;
                "
              >{{ formattedScaleMarks[2] }}</span>
              <span
                style="
                  width: 19%;
                  color: #909399;
                  font-size: 12px;
                  text-align: right;
                "
              >{{ formattedScaleMarks[3] }}</span>
              <span
                style="
                  width: 21%;
                  color: #909399;
                  font-size: 12px;
                  text-align: right;
                "
              >{{ formattedScaleMarks[4] }}</span>
            </div>
            <el-slider
              v-model="sliderValue"
              :marks="sliderMarksWithValues"
              :max="120"
              :min="80"
              :step="5"
              style="margin: 0"
              @change="sliderChange"
            />
          </div>
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
            width: 68%;
            padding: 10px 0 10px 10px;
            background-color: rgb(211 211 211);
          "
        >Vehicle Type: {{ description.vehicleType || '' }}, Make:
          {{ description.manufacturer || '' }}, Model:
          {{ description.modelNo || '' }}</span>
        <!-- <el-button
          type="primary"
          size="mini"
          :disabled="isBusy"
          style="padding: 7px 12px; height: 28px; margin-top: 16px"
          @click="limiterClick"
        >$50K Limiter</el-button> -->
      </div>
      <el-table
        v-loading="loading"
        element-loading-text="Loading"
        element-loading-spinner="el-icon-loading"
        :data="tableData"
        stripe
        height="20vh"
        style="width: 100%"
        border
        :header-cell-style="{ backgroundColor: 'rgb(246, 248, 250)' }"
      >
        <el-table-column prop="days" label="Days" width="80" sortable />
        <el-table-column
          prop="consumptionPeriod"
          label="Prediction Period"
          width="250"
          sortable
        >
          <template slot-scope="scope">
            <span>{{ scope.row.start }} - {{ scope.row.end }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="s01" label="S01" width="80" sortable />
        <el-table-column prop="s02" label="S02" width="80" sortable />
        <el-table-column prop="s03" label="S03" width="80" sortable />
        <el-table-column prop="s04" label="S04" width="80" sortable />
        <el-table-column prop="s05" label="S05" width="80" sortable />
        <el-table-column
          prop="total"
          label="Total Quantity"
          width="150"
          sortable
        >
          <template slot-scope="scope">
            <span>{{ scope.row.total | formatNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="currency"
          label="Currency"
          width="120"
          sortable
        />
        <el-table-column
          prop="estimatedCost"
          label="Estimated Cost"
          min-width="150"
          sortable
        >
          <template slot-scope="scope">
            <span>{{ scope.row.estimatedCost | formatNumber }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-table
        v-loading="loading1"
        element-loading-text="Loading"
        element-loading-spinner="el-icon-loading"
        :data="tableData1"
        stripe
        height="25vh"
        style="width: 100%; margin-top: 10px"
        border
        :header-cell-style="{ backgroundColor: 'rgb(246, 248, 250)' }"
      >
        <el-table-column prop="days" label="Days" width="80" sortable />
        <el-table-column
          prop="consumptionPeriod"
          label="Consumption Period"
          width="250"
          sortable
        >
          <template slot-scope="scope">
            <span>{{ scope.row.start }} - {{ scope.row.end }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="s01" label="S01" width="80" sortable />
        <el-table-column prop="s02" label="S02" width="80" sortable />
        <el-table-column prop="s03" label="S03" width="80" sortable />
        <el-table-column prop="s04" label="S04" width="80" sortable />
        <el-table-column prop="s05" label="S05" width="80" sortable />
        <el-table-column
          prop="totalQty"
          label="Total Quantity"
          width="150"
          sortable
        >
          <template slot-scope="scope">
            <span>{{ scope.row.totalQty | formatNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="currency"
          label="Currency"
          width="120"
          sortable
        />
        <el-table-column
          prop="totalCost"
          label="Total Cost"
          min-width="150"
          sortable
        >
          <template slot-scope="scope">
            <span>{{ scope.row.totalCost | formatNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="pm" label="PM" min-width="80" sortable>
          <template slot-scope="scope">
            <span>{{ scope.row.pm }}%</span>
          </template>
        </el-table-column>
        <el-table-column prop="cm" label="CM" min-width="80" sortable>
          <template slot-scope="scope">
            <span>{{ scope.row.cm }}%</span>
          </template>
        </el-table-column>
        <el-table-column prop="arsr" label="AR/SR" min-width="100" sortable>
          <template slot-scope="scope">
            <span>{{ scope.row.arsr }}%</span>
          </template>
        </el-table-column>
      </el-table>
      <div
        style="
          display: flex;
          align-items: center;
          width: 100%;
          margin-top: 10px;
        "
      >
        <el-table
          v-loading="loading2"
          element-loading-text="Loading"
          element-loading-spinner="el-icon-loading"
          :data="tableData2"
          stripe
          height="26vh"
          style="width: 80%"
          border
          :header-cell-style="{ backgroundColor: 'rgb(246, 248, 250)' }"
        >
          <el-table-column
            prop="poDate"
            label="PO Date"
            min-width="120"
            sortable
          >
            <template slot-scope="scope">
              <span>{{ showTime(scope.row.date) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="ponumber"
            label="PO Number"
            min-width="130"
            sortable
          />
          <el-table-column
            prop="vendor"
            label="Vendor"
            min-width="120"
            sortable
          />
          <el-table-column prop="name" label="Name" min-width="150" sortable />
          <el-table-column prop="unit" label="Unit" min-width="80" sortable />
          <el-table-column
            prop="orderedQuantity"
            label="Ordered Quantity"
            min-width="165"
            sortable
          >
            <template slot-scope="scope">
              <span>{{ scope.row.orderedQuantity | formatNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="outlineAgreement"
            label="Outline Agreement"
            min-width="180"
            sortable
          />
          <el-table-column
            prop="osQty"
            label="Outstanding Quantity"
            min-width="190"
            sortable
          >
            <template slot-scope="scope">
              <span>{{ scope.row.osQty | formatNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="unitPrice"
            label="Unit Price"
            min-width="120"
            sortable
          >
            <template slot-scope="scope">
              <span>{{ scope.row.unitPrice | formatNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="currency"
            label="Currency"
            min-width="115"
            sortable
          />
          <el-table-column
            prop="leadTime"
            label="Lead Time (Days)"
            min-width="170"
            sortable
          />
        </el-table>
        <div style="display: flex; flex-direction: column; margin-left: 10px">
          <div style="margin-bottom: 20px">
            <el-button
              style="width: 120px"
              type="primary"
              size="small"
              @click="$refs.potentialVendorsDialog.showDialog(material)"
            >Potential<br>Vendors 供應商</el-button>
            <el-button
              style="width: 120px"
              type="primary"
              size="small"
              @click="$refs.servicePackDialog.showDialog(material)"
            >Service Pack<br>維修套裝</el-button>
          </div>
          <div style="margin-bottom: 20px">
            <el-button
              style="width: 120px"
              type="primary"
              size="small"
              @click="$refs.exchangeableDialog.showDialog(material)"
            >Exchangeable<br>Materials 替換零件</el-button>
            <el-button
              style="width: 120px"
              type="primary"
              size="small"
              @click="$refs.feedbackReportDialog.showDialog(material, 'A1')"
            >Report Feedback<br>用後報告</el-button>
          </div>
          <el-button
            type="primary"
            size="small"
            @click="exitClick"
          >Exit 離開及列印<br>（Feedback & Print）</el-button>
        </div>
      </div>
    </el-card>
    <potential-vendors-dialog ref="potentialVendorsDialog" />
    <service-pack-dialog ref="servicePackDialog" />
    <exchangeable-dialog ref="exchangeableDialog" />
    <feedback-report-dialog ref="feedbackReportDialog" />
    <exit-dialog ref="exitDialog" />
  </div>
</template>

<script>
import moment from 'moment'
import {
  getTableDateList,
  getTableInfo,
  getTableMaterialList,
  tableLimit as saveTableLimit
} from '@/api/table'
import PotentialVendorsDialog from '@/views/PO/module/potentialVendorsDialog'
import ServicePackDialog from '@/views/PO/module/servicePackDialog'
import ExchangeableDialog from '@/views/PO/module/exchangeableDialog'
import FeedbackReportDialog from '@/views/PO/module/feedbackReportDialog'
import ExitDialog from '@/views/PO/module/exitDialog'
moment.locale('zh-cn')

export default {
  name: 'PoStrategyDetail',
  components: {
    ExitDialog,
    FeedbackReportDialog,
    ExchangeableDialog,
    ServicePackDialog,
    PotentialVendorsDialog
  },
  data() {
    return {
      isBusy: false,
      material: '',
      materialList: '',
      dateList: '',
      reportDate: '',
      limit: 0,
      sliderValue: 100,
      marks: {
        80: '80%',
        90: '90%',
        100: '100%',
        110: '110%',
        120: '120%'
      },
      description: {
        vehicleType: '',
        manufacturer: '',
        modelNo: ''
      },
      tableData: [],
      tableData1: [],
      tableData2: [],
      searchLoading: false,
      loading: false,
      loading1: false,
      loading2: false,
      costLimiterEnabled: false,
      costLimitValue: 50000,
      isInvalidValue: false,
      scaleValues: []
    }
  },
  computed: {
    scaleMarks() {
      const baseValue = Number(this.costLimitValue.toString().replace(/,/g, ''))
      const ninetyPercent = 0.8
      const eightyPercent = 0.9
      const ninetyonePercent = 1.1
      const ninetytwoPercent = 1.2

      return [
        baseValue * ninetyPercent,
        baseValue * eightyPercent,
        baseValue,
        baseValue * ninetyonePercent,
        baseValue * ninetytwoPercent
      ]
    },
    formattedScaleMarks() {
      return this.scaleMarks.map(value => `${(value / 1000).toFixed(0)}k`)
    },
    sliderMarksWithValues() {
      return {
        80: '80%',
        90: '90%',
        100: '100%',
        110: '110%',
        120: '120%'
      }
    }
  },
  // 添加 watch 来格式化输入值
  watch: {
    costLimitValue: {
      handler(newVal) {
        // 移除非数字字符
        const numStr = newVal.replace(/[^\d]/g, '')
        if (numStr !== newVal) {
          // 格式化数字
          this.costLimitValue = numStr
        }
      }
    }
  },
  created() {
    this.getMaterialList('')
    this.getDateList()
  },
  methods: {
    // 添加输入处理方法
    handleCostLimitInput(value) {
      if (!this.costLimiterEnabled) return
      // 移除所有逗号并转换为数字
      const numValue = Number(value.replace(/,/g, ''))

      if (!isNaN(numValue)) {
        console.log(numValue, '123')

        // 更新验证状态
        const percentage = (numValue / 50000) * 100
        // 确保百分比在80-120之间
        this.sliderValue = percentage
        // this.costLimitValue = this.costLimitValue
        // this.isBusy = true
        this.sliderValue = 100
        // limit按钮点击
        this.limit = 1
        this.tableLimit(this.costLimitValue)

        // 如果需要立即触发更新，可以调用 tableLimit
      }
    },

    // 重置按钮
    resetClick() {
      this.material = ''
      this.partNumber = ''
      this.reportDate = ''
      this.sliderValue = 100
      this.isBusy = false
      this.limit = 0
      this.costLimitValue = 50000
      this.getMaterialList('')
    },
    searchClick() {
      // 查询
      this.tableData = []
      this.getDataDetail()
    },
    remoteMethod(query) {
      // 下拉框远程搜索
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
          res.data.forEach((item, index) => {
            const map = {
              key: index,
              label: item.name,
              value: item.name
            }
            list.push(map)
          })
          this.materialList = list
        }
      })
    },
    getDateList() {
      this.dateList = []
      getTableDateList().then(res => {
        if (res.data) {
          const list = []
          res.data.forEach((item, index) => {
            const map = {
              label: item.date,
              value: index
            }
            list.push(map)
          })
          if (list && list.length > 0) {
            this.reportDate = list[0].label
          }
          this.dateList = list
        }
      })
    },
    sliderChange(value) {
      console.log(value, 'valllllllllllll')
      // 根据滑块百分比计算对应的金额
      const amount = Math.round((value / 100) * this.costLimitValue)
      console.log(amount, '12312')
      // 格式化金额并更新input值
      // this.costLimitValue = amount
      // 滑块改变
      const percentageLimitValue = amount
      this.limit = 1
      this.isBusy = false
      this.tableLimit(percentageLimitValue)
    },
    limiterClick() {
      // limit按钮点击
      this.limit = 1
      this.isBusy = true
      this.tableLimit()
    },
    tableLimit(costLimitValue = '') {
      const posList = []
      this.tableData2.forEach(item => {
        item.price = item.unitPrice
        posList.push(item)
      })
      this.loading = true
      saveTableLimit({
        limit: this.limit,
        amount: costLimitValue || this.costLimitValue,
        percentage: this.sliderValue / 100,
        // predictions: this.tableData,
        material: this.material,
        pos: posList
      }).then(res => {
        this.loading = false
        if (res.data) {
          this.tableData = res.data
        }
      })
    },
    getDataDetail() {
      getTableInfo({
        material: this.material,
        date: this.reportDate,
        amount: this.sliderValue * 50 * 10
      }).then(res => {
        this.loading = false
        this.loading2 = false
        this.loading1 = false
        if (res.data) {
          this.tableData = res.data.prediction
          this.tableData1 = res.data.consumption
          this.tableData2 = res.data.porecords
          this.description = res.data.description || {
            vehicleType: '',
            manufacturer: '',
            modelNo: ''
          }
          this.tableLimit()
        } else {
          this.$message.warning('Insufficient Data for AI prediction.')
        }
      })
    },
    exitClick() {
      this.$refs.exitDialog.showDialog(this.material, 'A1')
    },
    showTime(time) {
      // 时间展示
      return moment(time).format('DD/MM/YYYY')
    },
    updateData() {
      // 更新数据
      this.currentPage = 1
      this.getDataDetail()
    },
    resetCostLimit() {
      this.costLimitValue = 50000
      this.limit = 0
      this.getMaterialList('')
      this.sliderValue = 100
      this.isBusy = false
      this.tableLimit()
    },
    updateCostLimit() {
      // this.costLimitValue = this.costLimitValue
      this.isBusy = true

      // limit按钮点击
      this.limit = 1
      this.tableLimit()
    },
    handleSwitchChange(value) {
      if (!value) { // 当switch关闭时
        this.costLimitValue = 50000
        this.sliderValue = 100
        this.isInvalidValue = false
        this.limit = 0
        this.isBusy = false
        this.tableLimit()
      }
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
  content: '';
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
      font-family: 'Microsoft Yahei', Arial, sans-serif;
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

/deep/ .el-switch {
  .el-switch__label {
    color: #606266;
    font-size: 12px;
    &.is-active {
      color: #409eff;
    }
  }
  .el-switch__core {
    height: 20px;
    border-radius: 10px;
    width: 40px !important;
  }
  .el-switch__core:after {
    width: 16px;
    height: 16px;
  }
}
</style>
