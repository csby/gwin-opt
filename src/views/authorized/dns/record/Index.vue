<template>
  <div>
    <div class="header">
      <i class="el-icon-notebook-2"></i>
      <span>解析记录【{{zoneName}}】</span>
      <el-badge class="badge" type="info" :value="itemCount" v-if="itemCount > 0"/>
      <div>
        <el-tooltip placement="left">
          <div slot="content">
            <span>刷新</span>
          </div>
          <el-button type="text" icon="el-icon-refresh" @click="doGetList"/>
        </el-tooltip>
      </div>
    </div>
    <div class="table">
      <el-table v-loading="info.loading"
                aelement-loading-text="加载中..."
                element-loading-spinner="el-icon-loading"
                size="small"
                :max-height="heights.client - heights.top - heights.head"
                :data="info.items"
                :border="true"
                :stripe="true">
        <el-table-column
            type="index"
            label="编号"
            width="60" align="right" />
        <el-table-column label="主机记录"
                         prop="name"
                         :sortable="true" />
        <el-table-column label="记录值"
                         prop="data"
                         :sortable="true"/>
        <el-table-column width="105px">
          <template slot="header">
            <el-button type="text" size="small" @click="showAdd">添加记录</el-button>
          </template>
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="doDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
        <template slot="empty">
            <span v-if="isError" class="error">
                <i class="el-icon-error"></i>
                <div class="error-summary">{{error.summary}}</div>
                <div class="error-detail">{{error.detail}}</div>
            </span>
          <span v-else>暂无数据</span>
        </template>
      </el-table>
    </div>

    <div>
      <el-drawer class="drawer"
                 direction="rtl"
                 size="420px"
                 :append-to-body="true"
                 :destroy-on-close="true"
                 :visible.sync="add.visible">
        <div slot="title" class="drawer-header">
          <i class="el-icon-circle-plus"></i>
          <span>添加记录</span>
          <div />
        </div>
        <el-form size="small">
          <el-form-item label="主机记录" :required="true">
            <el-input v-model="add.args.name" @input="omAddInput" />
          </el-form-item>
          <el-form-item label="记录值（IP地址）" :required="true">
            <el-input v-model="add.args.data" :clearable="true" @input="omAddInput"/>
          </el-form-item>
        </el-form>
        <div class="error" v-show="isNotNullOrEmpty(add.error.summary) || isNotNullOrEmpty(add.error.detail)">
          <div class="summary">{{add.error.summary}}</div>
          <div class="detail">{{add.error.detail}}</div>
        </div>
        <div style="text-align: right;">
          <el-button type="primary"
                     :loading="add.committing"
                     :disabled="isNullOrEmpty(add.args.name) && isNullOrEmpty(add.args.data)"
                     @click="doAdd">确 定</el-button>
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
    $route: {
      handler: 'onRouteChanged'
    }
  }
})
class Index extends VueBase {
  zoneName = ''
  heights = {
    client: (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) - 1,
    top: 30,
    head: 25
  }

  info = {
    loading: false,
    items: [],
    error: {
      summary: '',
      detail: ''
    }
  }

  add = {
    visible: false,
    committing: false,
    args: {
      zoneName: '',
      name: '',
      data: ''
    },
    error: {
      summary: '',
      detail: ''
    }
  }

  onRouteChanged (val) {
    if (!val) {
      return
    }
    const params = val.params
    if (params) {
      if (params.zoneName) {
        this.zoneName = params.zoneName
      }
    }

    this.add.args.zoneName = this.zoneName
    this.doGetList()
  }

  onSizeChanged () {
    const clientHeight = window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight

    const paddingHeight = 1
    this.heights.client = clientHeight - paddingHeight
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

  showAdd () {
    this.add.args.name = ''
    this.add.args.data = ''
    this.add.error.summary = ''
    this.add.error.detail = ''
    this.add.committing = false
    this.add.visible = true
  }

  omAddInput () {
    this.add.error.summary = ''
    this.add.error.detail = ''
  }

  onAdd (code, err, data) {
    this.add.committing = false

    if (code === 0) {
      this.message('添加成功', 'success')
      this.doGetList()
    } else {
      this.add.error.summary = err.summary
      this.add.error.detail = err.detail
    }
  }

  doAdd () {
    if (this.add.committing) {
      return
    }

    const argument = this.add.args

    this.add.committing = true
    this.add.error.summary = ''
    this.add.error.detail = ''
    this.post(this.$uris.dnsRecordAdd, argument, this.onAdd)
  }

  onDelete (code, err, data) {
    if (code === 0) {
      this.message('删除成功', 'success')
      this.doGetList()
    } else {
      this.error(err)
    }
  }

  doDelete (row) {
    if (!row) {
      return
    }
    const argument = {
      zoneName: this.zoneName,
      name: row.name,
      data: row.data
    }
    this.post(this.$uris.dnsRecordDel, argument, this.onDelete)
  }

  onGetList (code, err, data) {
    this.info.loading = false
    if (code === 0) {
      this.info.items = data
    } else {
      this.info.items = []
      this.info.error.summary = err.summary
      this.info.error.detail = err.detail
    }
  }

  doGetList () {
    if (this.info.loading) {
      return
    }

    const argument = {
      zoneName: this.zoneName
    }

    this.info.loading = true
    this.info.error.summary = ''
    this.info.error.detail = ''
    this.post(this.$uris.dnsRecordList, argument, this.onGetList)
  }

  mounted () {
    this.onRouteChanged(this.$route)

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
  .error {
    color: red;
  }
  .error .summary {
    font-weight: bold;
  }
  .error .detail {
    font-style: italic;
    font-size: small;
  }
</style>
