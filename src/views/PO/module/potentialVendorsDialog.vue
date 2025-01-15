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
            prop="vendor"
            label="Vendor"
          />
          <el-table-column
            prop="name"
            label="Name"
          />
          <el-table-column
            prop="currency"
            label="Currency"
          />
          <el-table-column
            prop="maxPrice"
            label="Max Price"
          />
          <el-table-column
            prop="minPrice"
            label="Min Price"
          />
          <el-table-column
            prop="avgDeliveryLeadTime"
            label="Avg Delivery Lead Time"
          />
          <el-table-column
            prop="procurementCount"
            label="No. of procurement"
          />
          <el-table-column
            prop="orderedQty"
            label="No. of ordered Qty."
          />
          <el-table-column
            prop="orderUnit"
            label="Order Unit"
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
        <el-button type="primary" size="small">Print</el-button>
        <el-button size="small" @click="visible = false">Close</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { vendorList } from '@/api/table'
import moment from 'moment'
moment.locale('zh-cn')
export default {
  name: 'PotentialVendorsDialog',
  components: {},
  data() {
    return {
      visible: false,
      title: '',
      loading: false,
      total: 0,
      material: '',
      tableData: [],
      currentPage: 1,
      pageSize: 50
    }
  },
  methods: {
    showDialog(material) {
      this.title = 'Potential Vendors'
      this.material = material
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
    getDataList() {
      this.loading = false
      vendorList({
        material: this.material
      }).then(res => {
        this.loading = false
        this.tableData = []
        if (res.data) {
          this.tableData = res.data
        }
      })
    },
    exportClick() { // 自定义导出
      let url = window._CONFIG.baseUrl + '/material/vendor/list/export'
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
