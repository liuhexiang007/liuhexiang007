<template>
  <div id="assignPermission">
    <el-dialog :title="title" :visible.sync="visible">
      <div class="content">
        <el-tree
          ref="assignPermissionTree"
          :data="permissionList"
          show-checkbox
          node-key="id"
          :default-checked-keys="selectKeys"
          default-expand-all
          :expand-on-click-node="false"
          @check-change="handleCheckChange"
        >
          <span slot-scope="{ node }" class="custom-tree-node">
            <span>{{ node.label }}</span>
          </span>
        </el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="visible = false">Cancel</el-button>
        <el-button type="primary" :loading="loading" size="small" @click="makeSureAction">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import { menuList } from '@/api/table'

export default {
  name: 'AssignPermissionsDialog',
  data() {
    return {
      visible: false,
      title: '',
      record: '',
      permissionList: [],
      selectKeys: [],
      loading: false,
      selectNodes: []
    }
  },
  methods: {
    showDialog(record) {
      this.title = 'Role Menu'
      this.record = record
      this.visible = true
      this.loading = false
      this.selectKeys = record.selectKeys
      this.getMenuList()
    },
    handleCheckChange(data) { // 权限选中
      this.selectNodes = this.$refs.assignPermissionTree.getCheckedNodes(false, true)
    },
    getMenuList() {
      const path = {
        page: 0,
        limit: 500
      }
      menuList({}, path).then(res => {
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
                    temp.id = temp['menuId']
                    temp.label = temp.menuName
                    thirdLevel.push(temp)
                  }
                })
                data.children = thirdLevel
                if (data.parentId && data.parentId === item['menuId']) {
                  data.id = data['menuId']
                  data.label = data.menuName
                  secondLevel.push(data)
                }
              })
              item.children = secondLevel
              item.id = item['menuId']
              item.label = item.menuName
              firstLevel.push(item)
            }
          })
          this.permissionList = firstLevel
        }
      })
    },
    makeSureAction() {
      const key = []
      this.selectNodes.forEach(item => {
        key.push(item.id)
      })
      this.visible = false
      this.$emit('ok', key)
    }
  }
}
</script>

<style lang="less">

#assignPermission {
  .content {
    margin: 0 60px;
    .el-tree-node__content {
      height: 40px;
    }
  }
}

</style>
