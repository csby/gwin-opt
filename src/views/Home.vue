<template>
  <el-container>
    <el-header height="auto" ref="top">
      <Header />
    </el-header>
    <el-container>
      <el-aside width="auto" :style="mainStyle">
        <Navigation :min-height="mainHeight"/>
      </el-aside>
      <el-main :style="mainStyle">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
// @ is an alias to /src
import Vue from 'vue'
import Component from 'vue-class-component'
import Header from '@/components/nav/Header'
import Navigation from '@/components/nav/Catalog'

@Component({
  components: {
    Header,
    Navigation
  }
})
class Home extends Vue {
  mainHeight = 0

  get mainStyle () {
    const minHeight = this.mainHeight + 'px'
    return {
      'min-height': minHeight,
      'max-height': minHeight
    }
  }

  onSizeChanged () {
    const top = this.$refs.top
    if (!top) {
      return
    }

    const clientHeight = window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight

    let topHeight = top.offsetHeight
    if (top.$el) {
      topHeight = top.$el.offsetHeight
    }
    const marginHeight = 0
    const paddingHeight = 1
    this.mainHeight = clientHeight - topHeight - marginHeight - paddingHeight
  }

  mounted () {
    window.addEventListener('resize', this.onSizeChanged)
    this.onSizeChanged()
  }

  beforeDestroy () {
    window.removeEventListener('resize', this.onSizeChanged)
  }
}

export default Home
</script>

<style scoped>
.el-container {
  padding: 0;
}

.el-header {
  background-color: #0078D7;
  padding: 0;
  color: white;
}

.el-aside {
  padding: 0;
}

.el-main {
  padding: 0;
}
</style>
