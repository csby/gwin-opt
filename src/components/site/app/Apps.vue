<template>
  <div>
    <info style="margin-top: 5px" v-for="(item, index) in apps" :key="index" :id="item"/>
  </div>
</template>

<script>
import Component from 'vue-class-component'
import SocketBase from '@/components/SocketBase'
import Info from '@/components/site/app/Info'

@Component({
  components: {
    info: Info
  }
})
class Apps extends SocketBase {
  apps = []
  onGetApps (code, err, data) {
    this.loading = false
    if (code === 0) {
      this.apps = data
    } else {
      this.apps = []
    }
  }

  getApps () {
    const uri = this.$uris.siteWebAppList
    if (this.isNullOrEmpty(uri)) {
      return
    }

    this.post(uri, null, this.onGetApps)
  }

  mounted () {
    this.getApps()
  }
}

export default Apps
</script>

<style scoped>

</style>
