<template>
  <div>
    <div class="header">
      <i class="el-icon-coin"></i>
      <span>存储库</span>
      <el-badge class="badge" type="info" :value="itemCount" v-if="itemCount > 0"/>
      <div>
        <el-tooltip placement="left">
          <div slot="content">
            <span>新建存储库</span>
          </div>
          <el-button type="text" icon="el-icon-circle-plus" @click="showRepositoryAdd"/>
        </el-tooltip>
        <el-tooltip placement="top">
          <div slot="content">
            <span>刷新</span>
          </div>
          <el-button type="text" icon="el-icon-refresh" @click="doGetRepositories"/>
        </el-tooltip>
      </div>
    </div>

    <div>
      <el-container>
        <el-aside :style="heightStyle" width="360px">
          <el-tree ref="tree"
                   v-loading="info.loading"
                   element-loading-text="加载中..."
                   element-loading-spinner="el-icon-loading"
                   node-key="id"
                   :props="info.props"
                   :data="info.items"
                   :lazy="true"
                   :highlight-current="true"
                   :expand-on-click-node="false"
                   @node-expand="onNodeExpand"
                   @node-click="onNodeClick">
            <div slot-scope="{ node, data }">
              <div v-if="data.type === 0">
                 <span >
                   <i class="el-icon-coin"></i>
                   <span>&nbsp;{{data.name}}</span>
                 </span>
                <el-badge style="position: absolute; right: 5px; padding: 0; margin: 0;"
                          type="warning"
                          :value="data.revisions"/>
              </div>
              <div v-if="data.type === 1">
                <span>
                  <i class="el-icon-folder"></i>
                  <span>&nbsp;{{data.name}}</span>
                </span>
              </div>
            </div>
          </el-tree>
        </el-aside>
        <el-main :style="heightStyle">
          <div v-if="info.data">
            <div class="field">
              <div>
                <span>存储库:</span>
                <span>{{info.data.repository}}</span>
              </div>
              <div>
                <span>路径:</span>
                <span>{{info.data.path}}</span>
              </div>
              <div>
                <span>访问地址:</span>
                <span>{{info.data.url}}</span>
              </div>
              <div>
                <span>权限列表:</span>
                <el-badge class="badge" type="primary"
                          :value="permission.list.items.length"
                          v-if="permission.list.items.length > 0"/>
              </div>
            </div>
            <div class="table">
              <el-table v-loading="permission.list.loading"
                        element-loading-text="加载中..."
                        element-loading-spinner="el-icon-loading"
                        size="small"
                        :max-height="heights.client - heights.top - heights.head"
                        :data="permission.list.items"
                        :border="true"
                        :stripe="true">
                <el-table-column label="账号">
                  <template slot-scope="scope">
                    <span v-if="isNotNullOrEmpty(scope.row.accountName)">{{scope.row.accountName}}</span>
                    <span v-else>{{scope.row.accountId}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="权限" width="100px">
                  <template slot-scope="scope">
                    <span v-if="scope.row.accessLevel === 0">拒绝</span>
                    <span v-else-if="scope.row.accessLevel === 1">只读</span>
                    <span v-else-if="scope.row.accessLevel === 2">读写</span>
                    <span v-else></span>
                    <span v-show="scope.row.inherited" style="color: gray;">(继承)</span>
                  </template>
                </el-table-column>
                <el-table-column width="100px">
                  <template slot="header">
                    <el-button type="text" size="small" @click="showPermissionAdd">添加</el-button>
                  </template>
                  <template slot-scope="scope">
                    <el-button type="text" size="small" @click="showPermissionMod(scope.row)">修改</el-button>
                    <el-button v-show="scope.row.inherited === false" type="text" size="small" @click="doDeletePermission(scope.row.accountId)">删除</el-button>
                  </template>
                </el-table-column>
                <template slot="empty">
                  <div v-if="isNotNullOrEmpty(permission.list.error.summary)">
                    <el-alert type="error"
                              :closable="false"
                              :title="permission.list.error.summary"
                              :description="permission.list.error.detail" />
                  </div>
                  <span v-else>暂无数据</span>
                </template>
              </el-table>
            </div>
          </div>
        </el-main>
      </el-container>
    </div>

    <div>
      <el-drawer class="drawer"
                 direction="rtl"
                 size="420px"
                 :append-to-body="true"
                 :destroy-on-close="true"
                 :wrapperClosable="false"
                 :visible.sync="repository.add.visible">
        <div slot="title" class="drawer-header">
          <i class="el-icon-circle-plus"></i>
          <span>添加存储库</span>
          <div />
        </div>
        <div class="user-selected">
          <div>
            <span>存储库名称:</span>
          </div>
          <div>
            <el-input v-model="repository.add.args.name" size="small" />
          </div>
        </div>
        <div class="error-edit" v-show="this.isNotNullOrEmpty(repository.add.error.summary)">
          <el-alert :title="repository.add.error.summary"
                    :description="repository.add.error.detail"
                    :closable="false"
                    type="error" />
        </div>
        <div style="text-align: right;">
          <el-button size="medium"
                     :disabled="repository.add.submitting"
                     @click="repository.add.visible = false">
            <span>取 消</span>
          </el-button>
          <el-button size="medium"
                     :disabled="isNullOrEmpty(repository.add.args.name)"
                     :loading="repository.add.submitting"
                     :plain="true"
                     type="primary"
                     @click="doAddRepository">
            <span>确 定</span>
          </el-button>
        </div>
      </el-drawer>

      <el-drawer class="drawer"
                 direction="rtl"
                 size="420px"
                 :append-to-body="true"
                 :destroy-on-close="true"
                 :wrapperClosable="false"
                 :visible.sync="permission.add.visible">
        <div slot="title" class="drawer-header">
          <i class="el-icon-circle-plus"></i>
          <span>添加访问权限</span>
          <div />
        </div>
        <el-input placeholder="输入关键字进行过滤"
                  v-model="permissionFilter"
                  size="small"
                  :clearable="true"/>
        <el-tree ref="userTree"
                 class="user-tree"
                 :data="permission.add.users"
                 :highlight-current="true"
                 :default-expand-all="false"
                 :filter-node-method="filterPermissionUser"
                 @node-click="onPermissionUserNodeClick">
          <div slot-scope="{ node, data }" class="user-tree-body">
            <div>
              <i class="el-icon-user-solid"></i>
              <span>{{data.name}}</span>
            </div>
            <div style="font-style: italic; color: gray; padding-right: 10px;">{{data.account}}</div>
          </div>
        </el-tree>
        <div class="user-selected">
          <div>
            <span>用户:</span>
            <span v-show="isNullOrEmpty(permission.add.args.accountId)" style="color: red;">请从上面列表选择用户</span>
            <span>{{permission.add.selected.name}}</span>
            <span v-show="isNotNullOrEmpty(permission.add.selected.account)">({{permission.add.selected.account}})</span>
          </div>
          <div>
            <span>权限:</span>
            <el-radio-group v-model="permission.add.args.accessLevel" size="small">
              <el-radio-button :label="0">拒 绝</el-radio-button>
              <el-radio-button :label="1">只 读</el-radio-button>
              <el-radio-button :label="2">读 写</el-radio-button>
            </el-radio-group>
          </div>
        </div>
        <div class="error-edit" v-show="this.isNotNullOrEmpty(permission.add.error.summary)">
          <el-alert :title="permission.add.error.summary"
                    :description="permission.add.error.detail"
                    :closable="false"
                    type="error" />
        </div>
        <div style="text-align: right;">
          <el-button size="medium"
                     :disabled="permission.add.submitting"
                     @click="permission.add.visible = false">
            <span>取 消</span>
          </el-button>
          <el-button size="medium"
                     :disabled="isNullOrEmpty(permission.add.args.accountId)"
                     :loading="permission.add.submitting"
                     :plain="true"
                     type="primary"
                     @click="doAddPermission">
            <span>确 定</span>
          </el-button>
        </div>
      </el-drawer>

      <el-drawer class="drawer"
                 direction="rtl"
                 size="420px"
                 :append-to-body="true"
                 :destroy-on-close="true"
                 :wrapperClosable="false"
                 :visible.sync="permission.mod.visible">
        <div slot="title" class="drawer-header">
          <i class="el-icon-edit-outline"></i>
          <span>修改访问权限</span>
          <div />
        </div>
        <div class="user-selected">
          <div>
            <span>用户:</span>
            <span>{{permission.mod.name}}</span>
          </div>
          <div style="display: flex; align-items: start;">
            <span style="margin-top: 5px;">权限:</span>
            <div>
              <div>
                <el-radio v-show="permission.mod.inherited" v-model="permission.mod.args.accessLevel" :label="-1">
                  <span>继承</span>
                  <span v-if="permission.mod.accessLevel === 0">(拒绝)</span>
                  <span v-else-if="permission.mod.accessLevel === 0">(只读)</span>
                  <span v-else>(读写)</span>
                </el-radio>
              </div>
              <div>
                <el-radio v-model="permission.mod.args.accessLevel" :label="0">拒绝</el-radio>
              </div>
              <div>
                <el-radio v-model="permission.mod.args.accessLevel" :label="1">只读</el-radio>
              </div>
              <div>
                <el-radio v-model="permission.mod.args.accessLevel" :label="2">读写</el-radio>
              </div>
            </div>
          </div>
        </div>
        <div class="error-edit" v-show="this.isNotNullOrEmpty(permission.mod.error.summary)">
          <el-alert :title="permission.mod.error.summary"
                    :description="permission.mod.error.detail"
                    :closable="false"
                    type="error" />
        </div>
        <div style="text-align: right;">
          <el-button size="medium"
                     :disabled="permission.mod.submitting"
                     @click="permission.mod.visible = false">
            <span>取 消</span>
          </el-button>
          <el-button size="medium"
                     :disabled="permission.mod.args.accessLevel === -1 ||
                     ( permission.mod.inherited === false && permission.mod.args.accessLevel === permission.mod.accessLevel)"
                     :loading="permission.mod.submitting"
                     :plain="true"
                     type="primary"
                     @click="doModPermission">
            <span>确 定</span>
          </el-button>
        </div>
      </el-drawer>
    </div>
  </div>
</template>

<script>
import Component from 'vue-class-component'
import VueBase from '@/components/VueBase'

@Component({
  watch: {
    permissionFilter: {
      handler: 'onPermissionUserFilterChanged'
    }
  }
})
class Index extends VueBase {
  heights = {
    client: (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) - 1,
    top: 30,
    head: 25
  }

  users = []

  info = {
    loading: false,
    props: {
      label: 'name',
      children: 'children'
    },
    data: null,
    items: [],
    error: {
      summary: '',
      detail: ''
    }
  }

  repository = {
    add: {
      submitting: false,
      visible: false,
      args: {
        name: ''
      },
      error: {
        summary: '',
        detail: ''
      }
    }
  }

  permission = {
    list: {
      loading: false,
      items: [],
      error: {
        summary: '',
        detail: ''
      }
    },
    add: {
      submitting: false,
      visible: false,
      users: [],
      selected: {
        name: '',
        account: ''
      },
      args: {
        repository: '',
        path: '',
        accountId: '',
        accessLevel: 0
      },
      error: {
        summary: '',
        detail: ''
      }
    },
    mod: {
      submitting: false,
      visible: false,
      name: '',
      accessLevel: 0,
      inherited: false,
      args: {
        repository: '',
        path: '',
        accountId: '',
        accessLevel: 0
      },
      error: {
        summary: '',
        detail: ''
      }
    }
  }

  get heightStyle () {
    const minHeight = this.heights.client - this.heights.top - this.heights.head + 'px'
    return {
      'min-height': minHeight,
      'max-height': minHeight
    }
  }

  get itemCount () {
    if (this.info.items) {
      return this.info.items.length
    }

    return 0
  }

  get isError () {
    if (this.isNotNullOrEmpty(this.info.error.summary) || this.isNotNullOrEmpty(this.info.error.detail)) {
      return true
    } else {
      return false
    }
  }

  getUser (id) {
    if (!this.users) {
      return null
    }

    const c = this.users.length
    for (let i = 0; i < c; i++) {
      const u = this.users[i]
      if (u.id === id) {
        return u
      }
    }

    return null
  }

  getPermission (id) {
    if (!this.permission.list.items) {
      return null
    }

    const c = this.permission.list.items.length
    for (let i = 0; i < c; i++) {
      const p = this.permission.list.items[i]
      if (p.accountId === id) {
        return p
      }
    }

    return null
  }

  filterPermissionUser (value, data) {
    if (!value) {
      return true
    }

    if (data.name.indexOf(value) !== -1) {
      return true
    }

    return data.account.indexOf(value) !== -1
  }

  permissionFilter = ''
  onPermissionUserFilterChanged (newVal, oldVal) {
    this.$refs.userTree.filter(newVal)
  }

  onPermissionUserNodeClick (data) {
    this.permission.add.selected.name = data.name
    this.permission.add.selected.account = data.account
    this.permission.add.args.accountId = data.id
  }

  showRepositoryAdd () {
    this.repository.add.args.name = ''
    this.repository.add.error.summary = ''
    this.repository.add.error.detail = ''
    this.repository.add.submitting = false
    this.repository.add.visible = true
  }

  showPermissionAdd () {
    const items = []

    const c = this.users.length
    for (let i = 0; i < c; i++) {
      const u = this.users[i]
      const p = this.getPermission(u.id)
      if (p) {
        continue
      }
      items.push(u)
    }

    this.permission.add.users = items
    this.permission.add.args.repository = this.info.data.repository
    this.permission.add.args.path = this.info.data.path
    this.permission.add.args.accountId = ''
    this.permission.add.args.accessLevel = 0
    this.permission.add.selected.name = ''
    this.permission.add.selected.account = ''
    this.permission.add.error.summary = ''
    this.permission.add.error.detail = ''
    this.permission.add.submitting = false
    this.permission.add.visible = true
  }

  showPermissionMod (row) {
    if (!row) {
      return
    }

    this.permission.mod.args.repository = this.info.data.repository
    this.permission.mod.args.path = this.info.data.path
    this.permission.mod.args.accountId = row.accountId
    this.permission.mod.args.accessLevel = row.accessLevel
    this.permission.mod.name = row.accountName
    this.permission.mod.accessLevel = row.accessLevel
    this.permission.mod.inherited = row.inherited
    if (row.inherited) {
      this.permission.mod.args.accessLevel = -1
    }
    this.permission.mod.error.summary = ''
    this.permission.mod.error.detail = ''
    this.permission.mod.submitting = false
    this.permission.mod.visible = true
  }

  onNodeExpand (data, node) {
    if (!data) {
      return
    }
    if (!node) {
      return
    }

    this.doGetFolders(data, node)
  }

  onNodeClick (data, node) {
    if (!data) {
      return
    }
    if (!node) {
      return
    }

    this.info.data = data
    this.doGetPermissions()
  }

  onAddPermission (code, err, data) {
    this.permission.add.submitting = false
    if (code === 0) {
      this.doGetPermissions()
      this.permission.add.visible = false
    } else {
      this.permission.add.error.summary = err.summary
      this.permission.add.error.detail = err.detail
    }
  }

  doAddPermission () {
    if (!this.info.data) {
      return
    }
    if (this.permission.add.submitting) {
      return
    }

    const argument = this.permission.add.args

    this.permission.add.submitting = true
    this.permission.add.error.summary = ''
    this.permission.add.error.detail = ''
    this.post(this.$uris.svnPermissionAdd, argument, this.onAddPermission)
  }

  onModPermission (code, err, data) {
    this.permission.mod.submitting = false
    if (code === 0) {
      this.doGetPermissions()
      this.permission.mod.visible = false
    } else {
      this.permission.mod.error.summary = err.summary
      this.permission.mod.error.detail = err.detail
    }
  }

  doModPermission () {
    if (!this.info.data) {
      return
    }
    if (this.permission.mod.submitting) {
      return
    }

    const argument = this.permission.mod.args
    let uri = this.$uris.svnPermissionMod
    if (this.permission.mod.inherited) {
      uri = this.$uris.svnPermissionAdd
    }

    this.permission.mod.submitting = true
    this.permission.mod.error.summary = ''
    this.permission.mod.error.detail = ''
    this.post(uri, argument, this.onModPermission)
  }

  onDeletePermission (code, err, data) {
    if (code === 0) {
      this.doGetPermissions()
      this.message('删除成功', 'success')
    } else {
      this.error(err)
    }
  }

  doDeletePermission (id) {
    if (!this.info.data) {
      return
    }

    const argument = {
      repository: this.info.data.repository,
      path: this.info.data.path,
      accountId: id
    }

    this.post(this.$uris.svnPermissionDel, argument, this.onDeletePermission)
  }

  onGetPermissions (code, err, data) {
    this.permission.list.loading = false
    const items = []
    if (code === 0) {
      for (let i = 0; i < data.length; i++) {
        const item = data[i]
        const user = this.getUser(item.accountId)
        if (user) {
          item.accountName = user.name
        }
        items.push(item)
      }
    } else {
      this.permission.list.error.summary = err.summary
      this.permission.list.error.detail = err.detail
    }
    this.permission.list.items = items
  }

  doGetPermissions () {
    if (!this.info.data) {
      return
    }

    const argument = {
      name: this.info.data.repository,
      path: this.info.data.path
    }

    this.permission.list.loading = true
    this.permission.list.error.summary = ''
    this.permission.list.error.detail = ''
    this.post(this.$uris.svnPermissionList, argument, this.onGetPermissions)
  }

  onGetFolders (code, err, data) {
    if (code === 0) {
      const node = this.$refs.tree.getNode(data.id)
      if (node) {
        node.loaded = true
        const c = data.children.length
        for (let i = 0; i < c; i++) {
          const child = data.children[i]
          node.data.children.push(child)
        }
        node.loading = false
        if (c < 1) {
          node.isLeaf = true
        }
      }
    } else {
    }
  }

  doGetFolders (data, node) {
    if (!data) {
      return
    }
    if (!node) {
      return
    }
    if (node.loaded) {
      return
    }
    if (node.loading) {
      return
    }
    node.loading = true

    const argument = {
      id: data.id,
      name: data.repository,
      path: data.path
    }

    this.post(this.$uris.svnFolderList, argument, this.onGetFolders)
  }

  onGetRepositories (code, err, data) {
    this.info.loading = false
    if (code === 0) {
      this.info.items = data
    } else {
      this.info.items = []
      this.info.error.summary = err.summary
      this.info.error.detail = err.detail
      this.error(err)
    }
    this.info.data = null
  }

  doGetRepositories () {
    if (this.info.loading) {
      return
    }

    this.info.loading = true
    this.info.error.summary = ''
    this.info.error.detail = ''
    this.post(this.$uris.svnRepositoryList, null, this.onGetRepositories)
  }

  onAddRepository (code, err, data) {
    this.repository.add.submitting = false
    if (code === 0) {
      this.doGetRepositories()
      this.repository.add.visible = false
    } else {
      this.repository.add.error.summary = err.summary
      this.repository.add.error.detail = err.detail
    }
  }

  doAddRepository () {
    if (this.repository.add.submitting) {
      return
    }

    this.repository.add.submitting = true
    this.repository.add.error.summary = ''
    this.repository.add.error.detail = ''
    this.post(this.$uris.svnRepositoryAdd, this.repository.add.args, this.onAddRepository)
  }

  onGetUsers (code, err, data) {
    if (code === 0) {
      this.users = data
    }
  }

  doGetUsers () {
    this.post(this.$uris.svnUserAllList, null, this.onGetUsers)
  }

  onSizeChanged () {
    const clientHeight = window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight

    const paddingHeight = 1
    this.heights.client = clientHeight - paddingHeight
  }

  mounted () {
    this.doGetUsers()
    this.doGetRepositories()
    window.addEventListener('resize', this.onSizeChanged)
    this.onSizeChanged()
  }

  beforeDestroy () {
    window.removeEventListener('resize', this.onSizeChanged)
  }
}

export default Index
</script>

<style scoped>
  .header {
    display: flex;
    align-items: center;
    height: 25px;
    padding: 0px 8px;
    background-color: #f8f8f8;
  }
  .header /deep/ .el-button {
    padding: 0px 2px;
    margin-top: 0px;
    margin-bottom: 0px;
    font-size: medium;
  }
  .header :not(:first-child) {
    margin-left: 3px;
  }
  .header i:first-child {
    margin-top: 2px;
  }
  .header div:last-child {
    flex: 1;
    text-align: right;
  }
  .badge {
    padding: 0;
    margin-top: 3px;
  }

  .el-container, .el-aside, .el-main {
    margin: 0;
    padding: 0;
  }
  .el-aside {
    margin-right: 0px;
    border-right: solid 2px #f8f8f8;
  }

  .field {
    font-size: small;
  }
  .field div {
    display: flex;
    align-items: center;
  }
  .field div span:first-child {
    color: gray;
    width: 66px;
    text-align: right;
    margin-right: 5px;
  }

  .table {
  }
  .table /deep/ .el-table__header-wrapper tr th {
    background-color: #f8f8f8;
    padding: 2px 0px 1px 0px;
  }
  .table /deep/ .el-table th.el-table__cell {
    padding: 2px 0px;
    margin: 0;
  }
  .table /deep/ .el-table--small td {
    padding: 0;
    margin: 0;
    font-family: monospace;
  }
  .table /deep/ .el-button {
    padding: 1px 10px 0px 0px;
    margin: 0;
  }
  .drawer {
  }
  .drawer /deep/ .el-drawer__header{
    background-color: #0078D7;
    color: white;
    height: 26px;
    padding: 2px 10px;
    margin-bottom: 0px;
    margin-top: 0px;
  }
  .drawer /deep/ .el-drawer__body{
    margin: 0;
    padding: 5px 10px;
  }

  .drawer-header {
    height: 26px;
    display: flex;
    align-items: center;
  }
  .drawer-header /deep/ .el-button {
    padding: 0px 3px;
    font-size: medium;
    color: #f2f2f2;
  }
  .drawer-header i{
    padding-right: 5px;
  }
  .drawer-header :last-child {
    flex: 1;
    text-align: right;
  }

  .user-tree {
    border: #E4E7ED solid 1px;
    min-height: 100px;
    max-height: 300px;
    overflow: auto;
  }
  .user-tree-body {
    display: flex;
    align-items: center;
    width: 100%;
  }
  .user-tree-body div i {
    margin-right: 5px;
  }
  .user-tree-body :first-child {
    flex: 1;
  }

  .user-selected {
    padding: 10px 2px;
  }
  .user-selected div:not(:first-child) {
    margin-top: 5px;
  }
  .user-selected div span {
    margin-right: 10px;
  }

  .error-edit {
    margin-bottom: 5px;
    overflow: auto;
  }
</style>
