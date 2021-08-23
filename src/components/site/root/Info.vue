<template>
  <el-card :body-style="bodyStyle">
    <div slot="header" class="header">
      <div>
        <i class="el-icon-folder" ></i>
        <span>{{title}}</span>
        <el-badge class="badge" type="primary" :value="infos.length" v-if="infos.length > 1"/>
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
          <el-button style="padding: 2px 5px;" type="text" icon="el-icon-upload" @click="dlgVisible = true"/>
        </el-tooltip>
      </div>
    </div>
    <div v-loading="loading" element-loading-text="加载中...">
      <div class="item" v-for="(info, index) in infos" :key="index">
        <div class="header">
          <div>
            <span class="text">
              <a :href="info.url" target="_blank">{{info.name}}</a>
            </span>
          </div>

          <div>
            <el-tooltip content="上传时间" placement="left">
              <span>{{info.uploadTime}}</span>
            </el-tooltip>
            <el-tooltip v-show="info.url !== ''" content="复制访问地址" placement="top">
              <el-button style="padding: 0 5px; margin-left: 5px;"
                         type="text" icon="el-icon-document-copy" size="small"
                         v-clipboard:copy="info.url"/>
            </el-tooltip>
            <el-tooltip v-show="info.url !== ''" content="删除该文件" placement="right">
              <el-button style="padding: 0 5px; margin-left: 1px; color: red;"
                         type="text" icon="el-icon-delete" size="small"
                         @click="delFile(info.name)"/>
            </el-tooltip>
          </div>
        </div>
        <hr style="height: 1px; border: none; background-color: #f2f2f2;" />
      </div>
    </div>

    <fileUpload v-model="dlgVisible"
                width="500px"
                labelWidth="60px"
                accept="*"
                :title="'上传文件至' + title"
                :uri="this.$uris.siteRootFileUpload">
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
    title: {
      type: String,
      default: '默认网站 - 根目录'
    }
  }
})
class Info extends SocketBase {
  bodyStyle = {
    padding: '5px 20px'
  }

  dlgVisible = false
  loading = false
  infos = []

  onGetInfo (code, err, data) {
    this.loading = false
    if (code === 0) {
      this.infos = data
    } else {
      this.infos = []
    }
  }

  getInfo () {
    this.loading = true
    this.post(this.$uris.siteRootFileList, null, this.onGetInfo)
  }

  onDelFile (code, err, data) {
    if (code === 0) {
      // this.getInfo();
    }
  }

  delFile (name) {
    const argument = {
      name: name
    }

    this.post(this.$uris.siteRootFileDelete, argument, this.onDelFile)
  }

  onSocketMessage (id, data) {
    if (id === this.$evt.id.wsRootSiteUploadFile) {
      const infos = []
      this.infos.forEach(function (item, index) {
        if (item.name !== data.name) {
          infos.push(item)
        }
      })
      infos.push(data)
      this.infos = infos
    } else if (id === this.$evt.id.wsRootSiteDeleteFile) {
      const infos = []
      this.infos.forEach(function (item, index) {
        if (item.name !== data.name) {
          infos.push(item)
        }
      })
      this.infos = infos
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

.gray {
  background-color: lightgray;
}

.item {
  font-size: 13px;
  padding-bottom: 5px;
}

.text {
  font-weight: bold;
  padding-left: 2px;
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
