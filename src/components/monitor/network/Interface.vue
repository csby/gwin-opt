<template>
  <el-card :body-style="bodyStyle">
    <div slot="header" class="header">
      <div class="first">
        <i class="el-icon-set-up" ></i>
        <span>网卡信息</span>
        <el-badge class="badge" type="primary" :value="nics.length" v-if="nics.length > 1"/>
      </div>
      <div class="last">
        <el-select v-model="nic" value-key="name" placeholder="请选择网卡" class="selector" size="mini">
          <el-option v-for="(item, index) in nics"
                     :key="index"
                     :value="item"
                     :label="item.name">
          </el-option>
        </el-select>
      </div>
    </div>
    <div v-loading="loading" element-loading-text="加载中...">
      <div v-if="nic !== null">
        <div class="item">
          <span>网卡名称:</span>
          <span class="text">{{nic.name}}</span>
        </div>
        <div class="item">
          <span>最大传输单元:</span>
          <span class="text">{{nic.mtu}}</span>
        </div>
        <div class="item">
          <span>MAC地址:</span>
          <span class="text">{{nic.macAddress}}</span>
        </div>
        <div class="item">
          <span>IP地址:</span>
          <span class="text" >
            <template v-for="(addr, index) in nic.ipAddress">
              <div :key="index" v-if="isIpV4(addr)">{{addr}}&nbsp;</div>
            </template>
          </span>
        </div>
        <div class="item">
          <span>状态:</span>
          <span class="text" v-for="(flag, index) in nic.flags" :key="index">{{flag}}&nbsp;</span>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
import Component from 'vue-class-component'
import VueBase from '@/components/VueBase'

@Component
class Interface extends VueBase {
  bodyStyle = {
    padding: '5px 1px 5px 20px'
  }

  loading = false
  nics = new Array(0)
  nic = null

  isIpV4 (ip) {
    if (ip.indexOf(':') === -1) {
      return true
    }
    return false
  }

  onGetInterfaces (code, err, data) {
    this.loading = false
    this.nics = new Array(0)
    this.nic = null

    if (code === 0) {
      const count = data.length
      for (let i = 0; i < count; i++) {
        if (this.isNullOrEmpty(data[i].macAddress)) {
          continue
        }
        this.nics.push(data[i])
      }

      if (this.nics.length > 0) {
        this.$nextTick(function () {
          this.nic = this.nics[this.nics.length - 1]
        })
      }
    }
  }

  getInterfaces () {
    this.loading = true
    this.post(this.$uris.monitorNetworkInterfaces, null, this.onGetInterfaces)
  }

  mounted () {
    this.getInterfaces()
  }
}

export default Interface
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
.header .first {
  flex: 1;
}
.header .first i {
  width: 30px;
  text-align: center;
}
.header .last {
  display: flex;
  align-items: center;
}
.header .last .el-select {
  width: 120px;
  margin: 0px;
  padding: 0px;
}

.item {
  display: flex;
  align-items: flex-start;
  font-size: 13px;
  overflow: hidden;
}
.item:not(:first-child) {
  margin-top: 5px;
}

.text {
  font-weight: bold;
  margin-left: 3px;
}
</style>
