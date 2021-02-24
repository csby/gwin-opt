<script>
import Component from 'vue-class-component'
import SocketBase from '@/components/SocketBase'

@Component
class LogoutBase extends SocketBase {
  onLogout (code, err, data) {
    if (code === 0) {
      this.$db.clear()
      this.$db.set(this.$db.keys.autoLogin, false)

      this.$evt.fire(this.$evt.local.logout)
      this.toLogin()
    } else {
      this.error(err)
    }
  }

  logout () {
    this.post(this.$uris.logout, null, this.onLogout)
  }

  onSocketMessage (id, data) {
    if (id === this.$evt.id.wsOptUserLogout) {
      this.onLogout(0, null, null)
    }
  }
}

export default LogoutBase
</script>
