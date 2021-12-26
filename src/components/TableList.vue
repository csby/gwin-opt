<template>
  <el-table v-loading="isSearching"
            aelement-loading-text="加载中..."
            element-loading-spinner="el-icon-loading"
            :data="items"
            :border="border"
            :size="size"
            :max-height="maxHeight"
            :stripe="true">
    <slot name="columns"></slot>
    <template slot="empty">
            <span v-if="isError" class="error">
                <i class="el-icon-error"></i>
                <div class="error-summary">{{errSummary}}</div>
                <div class="error-detail">{{errDetail}}</div>
            </span>
      <span v-else>暂无数据</span>
    </template>
  </el-table>
</template>

<script>
import Component from 'vue-class-component'
import VueBase from '@/components/VueBase'

@Component({
  props: {
    uri: {
      type: String,
      default: ''
    },
    filter: {
      type: Object,
      default: null
    },
    border: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: ''
    },
    maxHeight: {
      type: [String, Number],
      default: '—'
    }
  }
})
class TableList extends VueBase {
  errSummary = ''
  errDetail = ''
  isError = false
  isSearching = false
  items = []

  onSearched (code, err, data) {
    this.isSearching = false

    if (code === 0) {
      this.isError = false
      this.items = data

      this.$emit('searched', data)
    } else if (code !== 101) {
      this.isError = true
      this.errSummary = err.summary
      this.errDetail = err.detail
      this.items = []

      this.$emit('searched', null)
    }
  }

  doSearch () {
    if (this.isNullOrEmpty(this.uri)) {
      return
    }

    this.isError = false
    this.isSearching = true
    this.post(this.uri, this.filter, this.onSearched)
  }

  mounted () {
    this.doSearch()
  }
}

export default TableList
</script>

<style scoped>
.error {
  color: red;
}

.error i {
  font-size: xx-large;
}

.error-summary {
  font-weight: bold;
}
.error-detail {
  font-style: italic;
}
</style>
