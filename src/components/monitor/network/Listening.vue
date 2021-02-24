<template>
  <el-card :body-style="bodyStyle">
    <div slot="header" class="header">
      <div>
        <i class="el-icon-s-opportunity" ></i>
        <span>监听端口</span>
        <el-badge class="badge" type="primary" :value="itemCount" v-if="itemCount > 0"/>
      </div>
      <div >
        <el-tooltip placement="top">
          <div slot="content">
            <span>刷新</span>
          </div>
          <el-button style="padding: 3px 5px;" type="text" icon="el-icon-refresh" @click="doSearch"/>
        </el-tooltip>
      </div>
    </div>

    <tableList class="content"
               ref="tableList"
               :uri="this.$uris.monitorListenPorts"
               size="small"
               :border="false"
               @searched="onSearched">
      <template slot="columns">
        <el-table-column
          label="序号"
          type="index"
          width="55"
          align="right">
        </el-table-column>
        <el-table-column
          prop="address"
          label="地址"
          align="right">
        </el-table-column>
        <el-table-column
          prop="port"
          label="端口"
          width="85px"
          align="left">
        </el-table-column>
        <el-table-column
          prop="protocol"
          label="协议"
          width="65px"
          align="left">
        </el-table-column>
      </template>
    </tableList>
  </el-card>
</template>

<script>
import Component from 'vue-class-component'
import VueBase from '@/components/VueBase'
import TableList from '@/components/TableList'

@Component({
  components: {
    tableList: TableList
  }
})
class Listening extends VueBase {
  bodyStyle = {
    padding: '8px 20px'
  }

  itemCount = 0

  onSearched (data) {
    if (data) {
      this.itemCount = data.length
    } else {
      this.itemCount = 0
    }
  }

  doSearch () {
    this.$refs.tableList.doSearch()
  }
}

export default Listening
</script>

<style scoped>
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
</style>
