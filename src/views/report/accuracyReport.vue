<template>
  <div id="permissionList" style="height: 90vh">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div style="display: flex;justify-content: space-between;align-items: center">
          <span>Accuracy Report 預測準確度報告
          </span>

        </div>
      </div>

      <!-- 表格部分 -->
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%;"
        border
        :header-cell-style="{ backgroundColor: 'rgb(246, 248, 250)' }"
      >
        <el-table-column
          prop="reportName"
          label="Report Name"
          min-width="300"
        />
        <el-table-column
          prop="createdOn"
          label="Created On"
          min-width="200"
        />
        <el-table-column
          label="Action"
          width="150"
          align="center"
        />
      </el-table>
    </el-card>
  </div>
</template>

<script>
import moment from 'moment'
import { menuDelete, menuList } from '@/api/table'

export default {
  name: 'PermissionList',
  data() {
    return {
      permissionList: [],
      permissionAIList: [],
      tableData: [],
      loading: false,
      menuList: [
        {
          menuId: '1803291628423659520', // Report 的 menuId
          children: [
            {
              menuId: '1852246054658004000',
              component: 'accuracyReport',
              createBy: 'Admin',
              createTime: null,
              icon: '',
              isCache: '',
              isFrame: '',
              menuName: 'Accuracy Report',
              menuType: 'C',
              orderNum: 999,
              parentId: '1803291628423659520',
              parentName: 'Report',
              path: '/accuracyReport',
              perms: null,
              query: '',
              remark: '',
              status: '',
              updateBy: null,
              updateTime: null,
              visible: '0'
            }
          ]
        }
      ]
    }
  },
  mounted() {
    // 权限列表type 1是PLM 2是AI
    this.getPLMPermissionList()
    this.getReportList() // 获取报告列表
  },
  methods: {
    formatDate(date) {
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    },
    getReportList() {
      // TODO: 调用API获取报告列表
      // this.tableData = ...
    },
    handleView(row) {
      // TODO: 处理查看报告详情
      console.log('View report:', row)
    },
    getPLMPermissionList() { // 获取PLM权限列表
      const loading = this.$loading({
        target: document.querySelector('#content'),
        text: 'Loading',
        spinner: 'el-icon-loading'
      })
      const path = {
        page: 0,
        limit: 500
      }
      menuList({}, path).then(res => {
        loading.close()
        this.permissionList = []
        if (res.data) {
          const list = res.data.list
          const firstLevel = []
          list.forEach((item) => {
            const secondLevel = []
            if (!item.parentId) {
              list.forEach(data => {
                const thirdLevel = []
                list.forEach(temp => {
                  if (temp.parentId && temp.parentId === data['menuId']) {
                    thirdLevel.push(temp)
                  }
                })
                data.children = thirdLevel
                if (data.parentId && data.parentId === item['menuId']) {
                  secondLevel.push(data)
                }
              })
              item.children = secondLevel
              firstLevel.push(item)
            }
          })
          this.permissionList = firstLevel
        }
      })
    },
    addMenuClick() { // 新增一级菜单(PLM)
      this.$refs.addNewPermissionDialog.showDialog({}, false)
    },
    append(node, data) { // 新增(PLM)
      this.$refs.addNewPermissionDialog.showDialog(data, false)
    },
    edit(node, data) { // 编辑(PLM)
      this.$refs.addNewPermissionDialog.showDialog(data, true)
    },
    remove(node, data) { // 删除(PLM)
      this.$confirm('Are you sure to delete this permission menu？', 'delete', {
        confirmButtonText: 'Sure',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        menuDelete({}, { 'menuId': data['menuId'] }).then(res => {
          if (res.code === 200) {
            this.$message({
              message: res.msg,
              type: 'success'
            })
            this.getPLMPermissionList()
          } else {
            this.$message.error(res.msg)
          }
        })
      }).catch(() => {})
    },
    updateData() { // 更新数据
      this.getPLMPermissionList()
    },
    handleSaveMenu() {
    //   const menuData = {
    //     children: [
    //       {
    //         path: '/accuracyReport',
    //         component: 'accuracyReport',
    //         menuName: 'Accuracy Report',
    //         parentId: '1803291628423659520',
    //         orderNum: 999,
    //         visible: '0'
    //       }
    //     ]
    //   }
    //   saveMenu(menuData).then(res => {
    //     // 处理保存响应
    //   })
    }
  }
}
</script>

  <style lang="less">

  #permissionList {
    display: flex;
    .box-card {
      width: 100%;
      margin: 20px;
      .clearfix:before,
      .clearfix:after {
        display: table;
        content: "";
      }
      .clearfix:after {
        clear: both
      }
    }
    .content {
      height: 72vh;
      overflow-y: scroll;
      margin: 30px;
      .el-tree-node__content {
        height: 40px;
      }
    }
    .custom-tree-node {
      flex: 1;
      display: flex;
      align-items: center;
      font-size: 14px;
      padding-left: 8px;
      span:nth-child(1) {
        width: 300px;
      }
    }
  }

  </style>
