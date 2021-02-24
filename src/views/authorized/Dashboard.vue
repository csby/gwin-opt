<template>
  <div class="dashboard">
    <div class="fill">
      <div>
        <siteRoot />
      </div>
      <div>
        <siteApps />
      </div>
    </div>
    <div class="fix">
      <div>
        <svcInfo />
      </div>
      <div class="not-first">
        <updInfo />
      </div>
      <div class="not-first">
        <monitorHost />
      </div>
      <div class="not-first">
        <monitorNetworkInterfaces />
      </div>
      <div class="not-first">
        <monitorNetworkListening />
      </div>
    </div>
  </div>
</template>

<script>
import Component from 'vue-class-component'
import VueBase from '@/components/VueBase'
import SvcInfo from '@/components/svc/opt/Info'
import UpdInfo from '@/components/svc/upd/Info'
import MonitorHost from '@/components/monitor/host/Host'
import MonitorNetworkInterfaces from '@/components/monitor/network/Interface'
import MonitorNetworkListening from '@/components/monitor/network/Listening'
import SiteRoot from '@/components/site/root/Info'
import SiteApps from '@/components/site/app/Apps'

@Component({
  components: {
    svcInfo: SvcInfo,
    updInfo: UpdInfo,
    monitorHost: MonitorHost,
    monitorNetworkInterfaces: MonitorNetworkInterfaces,
    monitorNetworkListening: MonitorNetworkListening,
    siteRoot: SiteRoot,
    siteApps: SiteApps
  }
})
class Dashboard extends VueBase {

}

export default Dashboard
</script>

<style scoped>
.dashboard {
  display: flex;
  align-items: flex-start;
  padding-bottom: 5px;
}

.dashboard .fill {
  flex: 1;
}

.dashboard .fix {
  padding-left: 10px;
  width: 420px;
}

.dashboard .not-first {
  margin-top: 5px;
}
</style>
