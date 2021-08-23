<template>
  <el-card :body-style="bodyStyle">
    <div slot="header" class="header">
      <div>
        <i :class="icon" ></i>
        <span>{{info.name}}</span>
        <el-tooltip :content="info.downloadTitle" placement="top" v-show="info.downloadUrl.length > 0">
          <a :href="info.downloadUrl" target="_blank" style="margin-top: 3px; color: #0078D7">
            <i class="el-icon-download" />
          </a>
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
      <div >
        <el-tooltip placement="top">
          <div slot="content">
            <span>上传</span>
          </div>
          <el-button style="padding: 2px 5px;" type="text" icon="el-icon-upload" @click="dlgVisible = true" :disabled="info.root.length === 0"/>
        </el-tooltip>
      </div>
    </div>
    <div v-loading="loading" element-loading-text="加载中...">
      <div class="item">
        <span>访问地址:</span>
        <span class="text">
                    <a :href="info.url" target="_blank">{{info.url}}</a>
                </span>
        <el-tooltip v-show="info.url !== ''" content="复制访问地址" placement="top">
          <el-button style="padding: 0 5px; margin-left: 5px;"
                     type="text" icon="el-icon-document-copy" size="small"
                     v-clipboard:copy="info.url"/>
        </el-tooltip>
      </div>
      <div class="item">
        <span>当前版本:</span>
        <span class="text">{{info.version}}</span>
      </div>
      <div class="item">
        <span>发布时间:</span>
        <span class="text">{{info.deployTime}}</span>
      </div>
      <div class="item" v-if="info.guid.length > 0">
        <span>网站标识:</span>
        <span class="text">{{info.guid}}</span>
      </div>
      <div class="item">
        <span>物理路径:</span>
        <span class="text">{{info.root}}</span>
      </div>
    </div>

    <fileUpload v-model="dlgVisible"
                width="500px"
                labelWidth="60px"
                :title="'上传' + info.name"
                file='file'
                :forms="forms"
                :uri="uploadUri">
    </fileUpload>
  </el-card>
</template>

<script>
import Component from 'vue-class-component'
import SocketBase from '@/components/SocketBase'
import FileUpload from '@/components/dlg/FileUpload'

@Component({
  components: {
    fileUpload: FileUpload
  },
  props: {
    id: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: 'el-icon-platform-eleme'
    },
    uploadId: {
      type: Number,
      default: 0
    }
  }
})
class Info extends SocketBase {
  bodyStyle = {
    padding: '5px 20px'
  }

  dlgVisible = false
  loading = false
  info = {
    url: '',
    name: '',
    guid: '',
    root: '',
    version: '',
    deployTime: '',
    downloadTitle: '',
    downloadUrl: ''
  }

  forms = [
    {
      name: 'id',
      value: this.id
    }
  ]

  infoUri = this.$uris.siteWebAppInfo
  uploadUri = this.$uris.siteWebAppUpload

  onGetInfo (code, err, data) {
    this.loading = false
    if (code === 0) {
      this.info.url = data.url
      this.info.name = data.name
      this.info.guid = data.guid
      this.info.root = data.root
      this.info.version = data.version
      this.info.deployTime = data.deployTime === null ? '' : data.deployTime
      this.info.downloadTitle = data.downloadTitle
      this.info.downloadUrl = data.downloadUrl
    } else {
      this.info.url = ''
      this.info.name = ''
      this.info.guid = ''
      this.info.root = ''
      this.info.version = ''
      this.info.deployTime = ''
      this.info.downloadTitle = ''
      this.info.downloadUrl = ''
    }
  }

  getInfo () {
    const uri = this.infoUri
    if (this.isNullOrEmpty(uri)) {
      return
    }

    const argument = {
      id: this.id
    }

    this.loading = true
    this.post(uri, argument, this.onGetInfo)
  }

  onSocketMessage (id, data) {
    if (id === this.$evt.id.wsSiteUpload) {
      if (data) {
        if (this.id === data.id) {
          this.info.url = data.url
          this.info.root = data.root
          this.info.version = data.version
          this.info.deployTime = data.deployTime
        }
      }
    }
  }

  mounted () {
    this.getInfo()
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
  padding-bottom: 5px;
}

.text {
  font-weight: bold;
  padding-left: 5px;
}

a:link {
  text-decoration: none;
}
a:visited {
  text-decoration: none;
}
a:hover {
  text-decoration: none;
}
a:active {
  text-decoration: none;
}
</style>
