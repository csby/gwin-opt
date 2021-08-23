<template>
  <el-card :body-style="bodyStyle" v-show="visible">
    <div slot="header" class="header">
      <div>
        <i class="el-icon-s-tools" ></i>
        <span>更新管理</span>
        <el-tooltip content="从github下载" placement="top">
          <a href="https://github.com/csby/gwsf-update/releases" target="_blank" style="margin-top: 3px; color: #0078D7">
            <i class="el-icon-download" />
          </a>
        </el-tooltip>
      </div>
      <div >
        <el-tooltip v-show="canRestart" placement="top">
          <div slot="content">
            <span>重启</span>
          </div>
          <el-button v-if="restarting" style="padding: 2px 5px;" type="text" icon="el-icon-loading"/>
          <el-button v-else style="padding: 2px 5px;" type="text" icon="el-icon-switch-button" @click="restart"/>
        </el-tooltip>
      </div>
      <div >
        <el-tooltip v-show="canUpdate" placement="top">
          <div slot="content">
            <span>上传</span>
          </div>
          <el-button style="padding: 2px 10px;" type="text" icon="el-icon-upload" @click="dlgVisible = true"/>
        </el-tooltip>
      </div>
      <div >
        <el-tooltip placement="top">
          <div slot="content">
            <span>刷新</span>
          </div>
          <el-button style="padding: 2px 5px;" type="text" icon="el-icon-refresh" @click="getInfo"/>
        </el-tooltip>
      </div>
    </div>
    <div v-loading="loading" element-loading-text="加载中...">
      <div class="item">
        <span>服务名称:</span>
        <span class="text">{{info.name}}</span>
      </div>
      <div class="item" v-if="isNotNullOrEmpty(info.bootTime)">
        <span>启动时间:</span>
        <span class="text">{{info.bootTime}}</span>
      </div>
      <div class="item" v-if="isNotNullOrEmpty(info.version)">
        <span>版本号:</span>
        <span class="text">{{info.version}}</span>
      </div>
      <div class="item">
        <span>状态:</span>
        <span class="text" v-if="info.status === 1">已停止</span>
        <span class="text" v-else-if="info.status === 2">运行中</span>
        <span class="text" v-else>未安装</span>
      </div>
    </div>

    <fileUpload v-model="dlgVisible"
                width="500px"
                labelWidth="60px"
                title="上传更新管理服务"
                :uri="this.$uris.updUpload"
                @onUploaded="onUploaded">
    </fileUpload>
  </el-card>
</template>

<script>
import Component from 'vue-class-component'
import VueBase from '@/components/VueBase'
import FileUpload from '@/components/dlg/FileUpload'

@Component({
  components: {
    fileUpload: FileUpload
  }
})
class Info extends VueBase {
  visible = false
  bodyStyle = {
    padding: '6px 1px 9px 20px'
  }

  loading = false
  canUpdate = false
  canRestart = false
  restarting = false
  info = {
    name: '',
    version: '',
    bootTime: '',
    remark: '',
    status: 0
  }

  dlgVisible = false

  onGetUpdateEnable (code, err, data) {
    if (code === 0) {
      this.canUpdate = data
    }
  }

  getUpdateEnable () {
    this.post(this.$uris.updUploadEnable, null, this.onGetUpdateEnable)
  }

  onGetRestartEnable (code, err, data) {
    if (code === 0) {
      this.canRestart = data
    }
  }

  getRestartEnable () {
    this.post(this.$uris.updRestartEnable, null, this.onGetRestartEnable)
  }

  onUploaded () {
    this.getInfo()
  }

  onRestart (code, err, data) {
    this.restarting = false
    if (code === 0) {
      this.getInfo()
    } else if (code !== 20001) {
    }
  }

  restart () {
    this.restarting = true
    this.post(this.$uris.updRestart, null, this.onRestart)
  }

  onGetInfo (code, err, data) {
    this.loading = false
    if (code === 0) {
      this.info.name = data.name
      this.info.bootTime = data.bootTime
      this.info.version = data.version
      this.info.remark = data.remark
      this.info.status = data.status
    }
  }

  getInfo () {
    this.loading = true
    this.post(this.$uris.updInfo, null, this.onGetInfo)
  }

  onGetEnable (code, err, data) {
    if (code === 0) {
      this.visible = data

      if (data) {
        this.getInfo()
        this.getUpdateEnable()
        this.getRestartEnable()
      }
    }
  }

  getEnable () {
    this.loading = true
    this.post(this.$uris.updEnable, null, this.onGetEnable)
  }

  mounted () {
    this.getEnable()
  }
}

export default Info
</script>

<style scoped>
.el-card /deep/ .el-card__header {
  background-color: #f8f8f8;
  padding: 6px;
}
.header {
  display: flex;
  align-items: center;
}
.header div {
  display: flex;
  align-items: center;
}
.header div:first-child {
  flex: 1;
}
.header div:first-child i {
  width: 30px;
  text-align: center;
}

.item {
  display: flex;
  align-items: center;
  font-size: 13px;
}
.item:not(:first-child) {
  margin-top: 5px;
}

.text {
  font-weight: bold;
  margin-left: 3px;
}
</style>
