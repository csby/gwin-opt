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

  get heightStyle () {
    const minHeight = (this.minHeight - 25) + 'px'
    return {
      'min-height': minHeight
    }
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

.navigation .btn .menu {
}
.navigation .btn .menu:not(.el-menu--collapse) {
  width: 200px;
}

</style>
