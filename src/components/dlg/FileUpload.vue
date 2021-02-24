<template>
  <el-dialog :visible.sync="visible"
             :title="title"
             :top="top"
             :width="width"
             :append-to-body="true"
             :close-on-click-modal="false"
             @closed="handleInput(false)">
    <template slot="title">
      <slot name="title">{{title}}</slot>
    </template>
    <div class="body">
      <el-form :label-width="labelWidth" :size="size">
        <el-form-item label="文件" :required="true">
          <el-input ref="inputFile"
                    v-model="selectedFile"
                    placeholder="请选择文件"
                    :readonly="true">
            <div v-if="selecting" slot="suffix" style="height: 100%; display: flex; align-items: center; color: blue;">
              <i class="el-icon-loading"></i>
            </div>
            <el-button slot="append" icon="el-icon-more" @click="selectFile" :disabled="uploading"></el-button>
          </el-input>
        </el-form-item>

        <slot :uploading="uploading"></slot>
      </el-form>

      <el-progress class="progress"
                   v-if="uploadProgressVisible"
                   :percentage="percentCompleted"
                   :color="uploadColor"/>
      <error-message class="content" :summary="errSummary" :detail="errDetail" :holder="false"/>
      <div>
        <span class="msg-status">{{statusMsg}}</span>
      </div>
    </div>
    <input class="input-file" ref="fileSelector" type="file" :accept="accept" v-on:input="onFileSelected" />
    <span slot="footer">
            <el-button :size="size" @click="visible = false">关 闭</el-button>
            <el-button :size="size" type="primary" :disabled="uploading" @click="uploadFile">上 传</el-button>
        </span>
  </el-dialog>
</template>

<script>
import Component from 'vue-class-component'
import VueBase from '@/components/VueBase'
import ErrorMessage from '@/components/Error'

@Component({
  components: {
    errorMessage: ErrorMessage
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '50%'
    },
    top: {
      type: String,
      default: '15vh'
    },
    size: {
      type: String,
      default: 'small'
    },
    file: {
      type: String,
      default: 'file'
    },
    forms: {
      type: Array,
      default: function () {
        return []
      }
    },
    preUpload: {
      type: Function,
      default: function () {
        return ''
      }
    },
    uri: {
      type: String,
      default: ''
    },
    accept: {
      type: String,
      default: '.zip, .tar, .gz'
    },
    labelWidth: {
      type: String,
      default: 'auto'
    }
  },
  watch: {
    value: {
      handler: 'onVisibleChanged'
    }
  }
})
class FileUpload extends VueBase {
  errSummary = ''
  errDetail = ''
  statusMsg = ''
  visible = false
  selectedFile = ''
  selecting = false
  uploading = false
  uploadColors = {
    normal: '#409eff',
    success: 'darkgreen',
    error: 'red'
  }

  uploadColor = this.uploadColors.normal
  percentCompleted = 0
  uploadProgressVisible = false

  handleInput (value) {
    this.$emit('input', value)
  }

  onVisibleChanged (val) {
    this.visible = val
    if (!val) {
      this.selectedFile = ''
      this.errSummary = ''
      this.errDetail = ''
      this.statusMsg = ''
      this.selecting = false
      this.uploading = false
      this.uploadProgressVisible = false
      this.$refs.fileSelector.value = null
    }
  }

  onFileSelected () {
    this.selecting = false
    this.selectedFile = this.$refs.fileSelector.value
  }

  selectFile () {
    this.$refs.fileSelector.click()
    this.selecting = true
  }

  onUploadingFile (evt) {
    this.percentCompleted = Math.round((evt.loaded * 100) / evt.total)
    if (evt.loaded === evt.total) {
      this.statusMsg = '上传完成， 正在发布...'
    }
  }

  onUploadedFile (code, err, data) {
    if (code === 0) {
      this.uploadColor = this.uploadColors.success
      this.statusMsg = '上传完成， 发布成功'
      this.$nextTick(function () {
        this.$emit('onUploaded')
      })
    } else {
      this.statusMsg = ''
      this.errSummary = err.summary
      this.errDetail = err.detail
      this.uploadColor = this.uploadColors.error
    }
    this.uploading = false
  }

  uploadFile () {
    this.uploadProgressVisible = false
    if (this.selectedFile === '') {
      this.errSummary = '请选择文件'
      this.$refs.inputFile.select()
      return
    }

    if (this.preUpload) {
      const error = this.preUpload()
      if (this.isNotNullOrEmpty(error)) {
        this.errSummary = error
        return
      }
    }

    const formData = new FormData()
    formData.append(this.file, this.$refs.fileSelector.files[0])
    if (this.forms) {
      const count = this.forms.length
      for (let i = 0; i < count; i++) {
        const item = this.forms[i]
        if (item) {
          formData.append(item.name, item.value)
        }
      }
    }

    const uri = this.uri
    if (this.isNullOrEmpty(uri)) {
      return
    }
    this.percentCompleted = 0
    this.uploadColor = this.uploadColors.normal
    this.uploadProgressVisible = true
    this.uploading = true
    this.statusMsg = '正在上传...'
    this.errSummary = ''
    this.errDetail = ''
    this.upload(uri, formData, this.onUploadedFile, this.onUploadingFile)
  }
}

export default FileUpload
</script>

<style scoped>
.progress {
  padding: 10px 0px 5px 0px;
  margin: 0px;
}
.input-file {
  display: none;
}
.msg-status {
  color: blue;
}
.item {
  display: flex;
  align-items: center;
}
.item-label {
  //display: block;
  text-align: right;
}
.item-content {
  margin-left: 5px;
  flex: 1;
}
</style>
