<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div class="title"><span>Role List</span></div>
      </div>
      <div class="searchBar" style="justify-content: flex-end">
        <!--        <div>-->
        <!--          <span>名称：</span>-->
        <!--          <el-input-->
        <!--            v-model="name"-->
        <!--            size="small"-->
        <!--            placeholder="请输入内容"-->
        <!--          >-->
        <!--            <i slot="prefix" class="el-input__icon el-icon-search" />-->
        <!--          </el-input>-->
        <!--        </div>-->
        <!--        <div>-->
        <!--          <el-button type="primary" size="small" @click="searchClick">Search</el-button>-->
        <!--        </div>-->
        <div style="margin-right: 0">
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
        @sort-change="shortChange"
      >
        <el-table-column
          prop="roleSort"
          label="Role Rank"
          sortable="custom"
        />
        <el-table-column
          prop="roleId"
          label="Role ID"
        />
        <el-table-column
          prop="roleName"
          label="Role Name"
          sortable="custom"
        />
        <el-table-column
          prop="status"
          label="Status"
          sortable="custom"
        >
          <template slot-scope="scope">
            <span>{{ String(scope.row.status) === '1' ? 'Disabled' : 'Enable' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="Create Time"
          sortable="custom"
        >
          <template slot-scope="scope">
            <span>{{ showTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="Option"
          width="150"
          fixed="right"
        >
          <template slot-scope="scope">
            <a @click="editClick(scope.row)">Edit</a>
            <el-popconfirm
              title="Are you sure to delete this data？"
              confirm-button-text="Sure"
              cancel-button-text="Cancel"
              @confirm="deleteClick(scope.row)"
            >
              <a slot="reference">Delete</a>
            </el-popconfirm>
            <!--            <a @click="permissionClick(scope.row)">Permission</a>-->
          </template>
        </el-table-column>
      </el-table>
      <div style="display: flex;justify-content: flex-end;margin-top: 20px">
        <el-pagination
          :current-page.sync="currentPage"
          :page-size="20"
          layout="prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <add-role-dialog ref="addRoleDialog" @ok="updateData" />
    <assign-permissions-dialog ref="assignPermissionsDialog" />
  </div>
</template>

<script>
import { roleDelete, roleList } from '@/api/table'
import moment from 'moment'
import AddRoleDialog from '@/views/account/modules/addRoleDialog'
import AssignPermissionsDialog from '@/views/account/modules/assignPermissionsDialog'
moment.locale('zh-cn')

export default {
  name: 'RoleList',
  components: { AssignPermissionsDialog, AddRoleDialog },
  data() {
    return {
      // name: '',
      sortMap: {},
      tableData: [],
      currentPage: 1,
      loading: true,
      total: 0
    }
  },
  mounted() {
    this.getRoleList()
  },
  methods: {
    searchClick() { // 查询
      this.currentPage = 1
      this.getRoleList()
    },
    shortChange(value) {
      this.sortMap = {}
      if (value.order === 'ascending') {
        this.sortMap[value.prop] = 0
      } else {
        this.sortMap[value.prop] = 1
      }
      this.getRoleList()
    },
    getRoleList() { // 获取角色列表
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
      roleList(params, path).then(res => {
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
    handleSizeChange(val) { // 每页条数变化
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) { // 当前页数切换
      this.currentPage = val
      this.getRoleList()
    },
    editClick(record) { // 编辑
      this.$refs.addRoleDialog.showDialog(record, true)
    },
    addClick() { // 新增
      this.$refs.addRoleDialog.showDialog('', false)
    },
    deleteClick(record) { // 删除
      roleDelete({}, { 'roleId': record.roleId }).then(res => {
        if (res.code === 200) {
          this.$message({
            message: res.msg,
            type: 'success'
          })
          this.getRoleList()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    permissionClick(record) { // 权限分配
      this.$refs.assignPermissionsDialog.showDialog(record)
    },
    updateData() { // 更新数据
      this.getRoleList()
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
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 10px;
  div {
    display: flex;
    align-items: center;
    margin-right: 10px;
    margin-top: 10px;
    span {
      white-space: nowrap;
      margin-top: 10px;
      font-size: 14px;
    }
    button {
      margin-top: 10px;
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
