<template>
  <div>
    <div class="header">
      <i class="el-icon-aim"></i>
      <span>筛选器</span>
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
        <el-table-column label="MAC地址"
                         prop="address"
                         width="135px" />
        <el-table-column label="描述"
                         prop="comment"
                         :sortable="true"/>
        <el-table-column width="105px">
          <template slot="header">
            <el-button type="text" size="small" @click="showAdd">新建筛选器</el-button>
          </template>
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="showMod(scope.row)">修改</el-button>
            <el-button type="text" size="small" @click="doDelete(scope.row.address)">删除</el-button>
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
          <span>添加筛选器</span>
          <div />
        </div>
        <el-form size="small">
          <el-form-item label="MAC地址（格式: XX-XX-XX-XX-XX-XX）" :required="true">
            <el-input v-model="add.args.address" @input="omAddInput" />
          </el-form-item>
          <el-form-item label="描述（格式: 所属者-设备类型-备注）">
            <el-input v-model="add.args.comment" :clearable="true" @input="omAddInput"/>
          </el-form-item>
        </el-form>
        <div class="error" v-show="isNotNullOrEmpty(add.error.summary) || isNotNullOrEmpty(add.error.detail)">
          <div class="summary">{{add.error.summary}}</div>
          <div class="detail">{{add.error.detail}}</div>
        </div>
        <div style="text-align: right;">
          <el-button type="primary"
                     :loading="add.committing"
                     :disabled="isNullOrEmpty(add.args.address)"
                     @click="doAdd">确 定</el-button>
        </div>
      </el-drawer>

      <el-drawer class="drawer"
                 direction="rtl"
                 size="420px"
                 :append-to-body="true"
                 :destroy-on-close="true"
                 :visible.sync="mod.visible">
        <div slot="title" class="drawer-header">
          <i class="el-icon-edit-outline"></i>
          <span>修改筛选器</span>
          <div />
        </div>
        <el-form size="small">
          <el-form-item label="MAC地址（格式: XX-XX-XX-XX-XX-XX）" :required="true">
            <el-input v-model="mod.args.filter.address" @input="omModInput" />
          </el-form-item>
          <el-form-item label="描述（格式: 所属者-设备类型-备注）">
            <el-input v-model="mod.args.filter.comment" :clearable="true" @input="omModInput"/>
          </el-form-item>
        </el-form>
        <div class="error" v-show="isNotNullOrEmpty(mod.error.summary) || isNotNullOrEmpty(mod.error.detail)">
          <div class="summary">{{mod.error.summary}}</div>
          <div class="detail">{{mod.error.detail}}</div>
        </div>
        <div style="text-align: right;">
          <el-button type="primary"
                     :loading="mod.committing"
                     :disabled="isNullOrEmpty(mod.args.filter.address)"
                     @click="doModify">确 定</el-button>
        </div>
      </el-drawer>
    </div>
  </div>
</template>

<script>
import Component from 'vue-class-component'
import VueBase from '@/components/VueBase'

@Component
class Index extends VueBase {
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
      allow: true,
      address: '',
      comment: ''
    },
    error: {
      summary: '',
      detail: ''
    }
  }

  mod = {
    visible: false,
    committing: false,
    args: {
      address: '',
      filter: {
        allow: true,
        address: '',
        comment: ''
      }
    },
    error: {
      summary: '',
      detail: ''
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

  showAdd () {
    this.add.args.address = ''
    this.add.args.comment = ''
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
    this.post(this.$uris.dhcpFilterAdd, argument, this.onAdd)
  }

  showMod (item) {
    if (!item) {
      return
    }

    this.mod.args.address = item.address
    this.mod.args.filter.address = item.address
    this.mod.args.filter.comment = item.comment
    this.mod.error.summary = ''
    this.mod.error.detail = ''
    this.mod.committing = false
    this.mod.visible = true
  }

  omModInput () {
    this.mod.error.summary = ''
    this.mod.error.detail = ''
  }

  onModify (code, err, data) {
    this.mod.committing = false

    if (code === 0) {
      this.message('修改成功', 'success')
      this.doGetList()
      this.mod.visible = false
    } else {
      this.mod.error.summary = err.summary
      this.mod.error.detail = err.detail
    }
  }

  doModify () {
    if (this.mod.committing) {
      return
    }

    const argument = this.mod.args

    this.mod.committing = true
    this.mod.error.summary = ''
    this.mod.error.detail = ''
    this.post(this.$uris.dhcpFilterMod, argument, this.onModify)
  }

  onDelete (code, err, data) {
    if (code === 0) {
      this.message('删除成功', 'success')
      this.doGetList()
    } else {
      this.error(err)
    }
  }

  doDelete (address) {
    const argument = {
      address: address
    }
    this.post(this.$uris.dhcpFilterDel, argument, this.onDelete)
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

    this.info.loading = true
    this.info.error.summary = ''
    this.info.error.detail = ''
    this.post(this.$uris.dhcpFilterList, null, this.onGetList)
  }

  onSizeChanged () {
    const clientHeight = window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight

    const paddingHeight = 1
    this.heights.client = clientHeight - paddingHeight
  }

  mounted () {
    this.doGetList()
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
