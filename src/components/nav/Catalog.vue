<template>
  <div class="navigation">
    <div class="btn" @click="menuCollapse = !menuCollapse">
      <span v-if="menuCollapse" class="icon">
          <i class="el-icon-s-unfold" />
      </span>
      <span v-else class="icon">
          <i class="el-icon-s-data" />
      </span>
    </div>

    <el-menu class="menu" :style="heightStyle"
             :collapse="menuCollapse"
             :router="true"
             :default-active="defaultActive">
      <el-menu-item index="/">
        <i class="el-icon-menu"></i>
        <span slot="title">控制面板</span>
      </el-menu-item>
      <el-submenu index="/dhcp" v-if="info.dhcp.enable">
        <template slot="title">
          <i class="el-icon-crop"></i>
          <span>DHCP</span>
        </template>
        <el-menu-item index="/dhcp/filter">
          <i class="el-icon-aim"></i>
          <span slot="title">筛选器</span>
        </el-menu-item>
        <el-menu-item index="/dhcp/lease">
          <i class="el-icon-location"></i>
          <span slot="title">地址租用</span>
        </el-menu-item>
      </el-submenu>
      <el-submenu index="dns/record" v-if="info.dns.enable">
        <template slot="title">
          <i class="el-icon-notebook-1"></i>
          <span>DNS</span>
        </template>
        <el-menu-item v-for="(item, index) in info.dns.zoomNames"
                      :key="index" :index="'/dns/record/' + item">
          <i class="el-icon-notebook-2"></i>
          <span slot="title">{{item}}</span>
        </el-menu-item>
      </el-submenu>
      <el-submenu index="/svn" v-if="info.svn.enable">
        <template slot="title">
          <i class="el-icon-files"></i>
          <span>SVN</span>
        </template>
        <el-menu-item index="/svn/repository">
          <i class="el-icon-coin"></i>
          <span slot="title">存储库</span>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
import Component from 'vue-class-component'
import VueBase from '@/components/VueBase'

@Component({
  props: {
    minHeight: {
      type: Number,
      default: 100
    },
    defaultActive: {
      type: String,
      default: ''
    }
  }
})
class Catalog extends VueBase {
  menuCollapse = false

  info = {
    dhcp: {
      enable: false
    },
    dns: {
      enable: false,
      zoomNames: []
    },
    svn: {
      enable: false
    }
  }

  get heightStyle () {
    const minHeight = (this.minHeight - 25) + 'px'
    return {
      'min-height': minHeight
    }
  }

  onGetSetting (code, err, data) {
    if (code === 0) {
      this.info.dhcp.enable = data.dhcp.enable
      this.info.dns.enable = data.dns.enable
      this.info.dns.zoomNames = data.dns.zoomNames
      this.info.svn.enable = data.svn.enable
    } else {
    }
  }

  doGetSetting () {
    this.post(this.$uris.svcSettingApi, null, this.onGetSetting)
  }

  mounted () {
    this.doGetSetting()
  }
}

export default Catalog
</script>

<style scoped>
.navigation {
}

.navigation .btn {
  display: flex;
  align-items: center;
  height: 25px;
  background-color: #f8f8f8;
  border-right: 1px solid #e6e6e6;
  cursor: pointer;
}

.navigation .menu {
}
.navigation .menu:not(.el-menu--collapse) {
  width: 200px;
}

</style>
