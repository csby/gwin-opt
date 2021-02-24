import Vue from 'vue'
import VueClipboard from 'vue-clipboard2'
import ElementUI from 'element-ui'
import Net from '@/network/net'
import Evt from '@/event/bus'
import App from './App.vue'
import router from './router'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(VueClipboard)
Vue.use(ElementUI)

Vue.prototype.$msg = ElementUI.Message
Vue.prototype.$notify = ElementUI.Notification
Vue.prototype.$net = Net
Vue.prototype.$uris = Net.uris
Vue.prototype.$db = Net.db
Vue.prototype.$evt = Evt

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
