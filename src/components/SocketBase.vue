<script>
import Component from 'vue-class-component'
import VueBase from '@/components/VueBase'

@Component
class SocketBase extends VueBase {
  sendSocketMessage (id, data) {
    this.$evt.fire(this.$evt.local.socket, id, data)
  }

  onSocketMessage (id, data) {
  }

  onSocketNotify (id, data) {
    this.onSocketMessage(id, data)
  }

  mounted () {
    this.$evt.on(this.$evt.websocket.notify, this.onSocketNotify)
  }

  beforeDestroy () {
    this.$evt.off(this.$evt.websocket.notify, this.onSocketNotify)
  }
}

export default SocketBase
</script>
