<template>
  <div class="header">
    <img class="logo" alt="logo" src="../../assets/logo.png"  @click="to('/')"/>
    <span class="title">服务管理平台{{frontVersion}}</span>
    <LoginUser />
  </div>
</template>

<script>
import Component from 'vue-class-component'
import VueBase from '@/components/VueBase'
import Version from '@/version'
import LoginUser from '@/components/auth/LoginUser'

@Component({
  components: {
    LoginUser
  }
})
class Header extends VueBase {
  frontVersion = Version.version
}

export default Header
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  height: 30px;
  padding: 0 5px 0 1px;
}
.header .logo {
  height: 60%;
  cursor: pointer;
}
.header .logo:hover {
  color: #409eff;
}
.header .title {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 0px 5px;
  font-size: medium;
}
</style>
