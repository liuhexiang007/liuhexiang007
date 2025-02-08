<template>
  <div id="permissionList" style="height: 90vh">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div style="display: flex;justify-content: space-between;align-items: center">
          <span>Menu List</span>
          <el-button type="primary" size="small" @click="addMenuClick">+ New</el-button>
        </div>
      </div>
      <div id="content" class="content">
        <el-tree
          :data="permissionList"
          node-key="id"
          default-expand-all
          :expand-on-click-node="false"
        >
          <span slot-scope="{ node, data }" class="custom-tree-node">
            <span>{{ data.menuName + ' ( ' + data.orderNum + ' ) ' }}</span>
            <span>
              <el-button
                v-if="node.level !== 3"
                type="text"
                size="mini"
                @click="() => append(node, data)"
              >
                add
              </el-button>
              <el-button
                type="text"
                size="mini"
                @click="() => edit(node, data)"
              >
                edit
              </el-button>
              <el-button
                type="text"
                size="mini"
                @click="() => remove(node, data)"
              >
                delete
              </el-button>
            </span>
          </span>
        </el-tree>
      </div>
    </el-card>
    <add-new-permission-dialog ref="addNewPermissionDialog" @ok="updateData" />
  </div>
</template>

<script>

import AddNewPermissionDialog from '@/views/account/modules/addNewPermissionDialog'
import { menuDelete, menuList } from '@/api/table'
export default {
  name: 'PermissionList',
  components: { AddNewPermissionDialog },
  data() {
    return {
      permissionList: [],
      permissionAIList: []
    }
  },
  mounted() {
    // 权限列表type 1是PLM 2是AI
    this.getPLMPermissionList()
  },
  methods: {
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
