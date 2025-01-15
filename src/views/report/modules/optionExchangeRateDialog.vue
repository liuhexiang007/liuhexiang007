<template>
  <div>
    <el-dialog :title="title" :visible.sync="visible" width="40%">
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
            prop="currency"
            label="Currency"
          />
          <el-table-column
            prop="exchangeRate"
            label="HKD"
          >
            <template slot-scope="scope">
              <el-input v-model="scope.row.exchangeRate" type="number"></el-input>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="isLoading" size="small" @click="confirmClick">Confirm</el-button>
        <el-button size="small" @click="visible = false">Close</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { a4Currencies, a4Currency } from '@/api/table'
import moment from 'moment'
moment.locale('zh-cn')
export default {
  name: 'OptionExchangeRateDialog',
  components: {},
  data() {
    return {
      visible: false,
      title: '',
      loading: false,
      isLoading: false,
      tableData: []
    }
  },
  methods: {
    showDialog() {
      this.title = 'Set Exchange Rate'
      this.getDataList()
      this.visible = true
      this.isLoading = false
    },
    getDataList() {
      this.loading = true
      a4Currencies({
        material: this.material
      }).then(res => {
        this.loading = false
        this.tableData = []
        if (res.data) {
          this.tableData = res.data
        }
      })
    },
    showTime(time) { // 时间展示
      if (!time) {
        return ''
      }
      return moment(time).format('YYYY-MM-DD HH:mm:ss')
    },
    confirmClick() {
      this.isLoading = true
      a4Currency(this.tableData).then(res => {
        this.isLoading = false
        if (res.code === 200) {
          this.$message.success(res.msg)
          this.visible = false
        } else {
          this.$message.error(res.msg)
        }
      })
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
