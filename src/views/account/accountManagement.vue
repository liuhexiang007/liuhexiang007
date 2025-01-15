<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div class="title"><span>Account Management 用戶管理</span></div>
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
          <div class="item">
            <span>Date Range：</span>
            <el-date-picker
              v-model="value1"
              size="small"
              type="daterange"
              unlink-panels
              start-placeholder="Start Date"
              end-placeholder="End Date"
              @change="datePickerChange"
            />
          </div>
          <el-button type="primary" size="small" @click="searchClick">Search</el-button>
        </div>
        <div class="buttonItem">
          <el-button v-if="isHaveButton('/accountManagement/new')" type="primary" size="small" @click="addClick">+ New</el-button>
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
        @sort-change="shortChange"
      >
        <el-table-column
          type="index"
          min-width="50"
          fixed
        />
        <el-table-column
          prop="userId"
          label="User ID"
          width="200"
        />
        <el-table-column
          prop="userName"
          label="User Name"
          width="200"
          sortable="custom"
        />
        <el-table-column
          prop="nickName"
          label="Nick Name"
          width="200"
          sortable="custom"
        />
        <el-table-column
          prop="roleName"
          label="Role Name"
          width="200"
          sortable="custom"
        />
        <el-table-column
          prop="email"
          label="Email"
          width="200"
          sortable="custom"
        />
        <!--        <el-table-column-->
        <!--          prop="phonenumber"-->
        <!--          label="Phone Number"-->
        <!--          width="150"-->
        <!--        />-->
        <el-table-column
          prop="status"
          label="Status"
          width="100"
          sortable="custom"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.status === '0' ? 'Enabled' : 'Disabled' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createBy"
          label="Create By"
          width="150"
          sortable="custom"
        />
        <el-table-column
          prop="createTime"
          label="Registration Date"
          width="200"
          sortable="custom"
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
            <a v-if="isHaveButton('/accountManagement/edit')" @click="editClick(scope.row)">Edit</a>
            <el-popconfirm
              title="Are you sure to delete this data？"
              confirm-button-text="Sure"
              cancel-button-text="Cancel"
              @confirm="deleteClick(scope.row)"
            >
              <a v-if="isHaveButton('/accountManagement/delete')" slot="reference">Delete</a>
            </el-popconfirm>
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
    <add-user-dialog ref="addUserDialog" @ok="updateData" />
  </div>
</template>

<script>
import moment from 'moment'
import { roleList, userDelete, userList } from '@/api/table'
import AddUserDialog from '@/views/account/modules/addUserDialog'
moment.locale('zh-cn')

export default {
  name: 'AccountManagement',
  components: { AddUserDialog },
  data() {
    return {
      value1: [],
      startTime: '',
      endTime: '',
      fileName: '',
      roleList: '',
      checkList: [],
      tableData: [],
      sortMap: {},
      currentPage: 1,
      total: 0,
      loading: false
    }
  },
  created() {
    this.getNeedData()
  },
  methods: {
    async getNeedData() {
      await this.getRoleList()
      this.getUserList()
    },
    searchClick() { // 查询
      this.currentPage = 1
      this.getUserList()
    },
    handleSizeChange(val) { // 每页条数变化
    },
    handleCurrentChange(val) { // 当前页数切换
      this.currentPage = val
      this.getUserList()
    },
    addClick() {
      this.$refs.addUserDialog.showDialog({}, false)
    },
    editClick(record) {
      this.$refs.addUserDialog.showDialog(record, true)
    },
    shortChange(value) {
      this.sortMap = {}
      if (value.order === 'ascending') {
        this.sortMap[value.prop] = 0
      } else {
        this.sortMap[value.prop] = 1
      }
      this.getUserList()
    },
    getRoleList() { // 获取角色列表
      return new Promise(resolve => {
        const path = {
          page: 0,
          limit: 500
        }
        roleList({}, path).then(res => {
          if (res.data) {
            const list = res.data.list
            const firstLevel = []
            list.forEach((item) => {
              const map = {
                label: item.roleName,
                value: item.roleId
              }
              firstLevel.push(map)
            })
            this.roleList = firstLevel
          }
          resolve()
        }).catch(() => {
          resolve()
        })
      })
    },
    getUserList() {
      const params = {}
      for (const paramsKey in this.sortMap) {
        params.sortKey = paramsKey
        params.sortValue = this.sortMap[paramsKey]
      }
      const path = {
        page: this.currentPage - 1,
        limit: 10
      }
      this.loading = true
      userList(params, path).then(res => {
        this.loading = false
        if (res.data) {
          this.total = res.data.total
          res.data.list.forEach(item => {
            const roleName = []
            if (item.roleIds && item.roleIds.length > 0) {
              item.roleIds.forEach(temp => {
                this.roleList.forEach(role => {
                  if (String(role.value) === String(temp)) {
                    roleName.push(role.label)
                  }
                })
              })
            }
            item.roleName = roleName.join(',')
          })
          this.tableData = res.data.list
        }
      })
    },
    datePickerChange(val) { // 时间范围选择
      if (!val) {
        this.startTime = ''
        this.endTime = ''
      }
      if (this.value1 && this.value1.length > 1) {
        const start = moment(this.value1[0]).format('YYYY-MM-DD HH:mm:ss')
        const end = moment(this.value1[1]).format('YYYY-MM-DD HH:mm:ss')
        this.startTime = start
        this.endTime = end
        this.currentPage = 1
        this.getReportDataList()
      }
    },
    showTime(time) { // 时间展示
      return moment(time).format('YYYY-MM-DD HH:mm:ss')
    },
    deleteClick(record) { // 删除
      userDelete({}, { 'userId': record.userId }).then(res => {
        if (res.code === 200) {
          this.$message({
            message: res.msg,
            type: 'success'
          })
          this.getUserList()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    updateData() { // 更新数据
      this.currentPage = 1
      this.getUserList()
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
