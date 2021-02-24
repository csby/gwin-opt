<script>
import Component from 'vue-class-component'
import VueBase from '@/components/VueBase'
import Version from '@/version'
import JsEncrypt from 'jsencrypt/bin/jsencrypt'

@Component({
  watch: {
    autoLogin: {
      handler: 'autoLoginChanged'
    },
    rememberPassword: {
      handler: 'rememberPasswordChanged'
    }
  }
})
class LoginBase extends VueBase {
  frontVersion = Version.version
  errSummary = ''
  errDetail = ''
  captchaLength = 5
  captchaWidth = 120
  captchaHeight = 40
  loadingCaptcha = false
  captchaRequired = false
  captchaId = ''
  captchaVal = ''
  rsaPublicKey = ''
  logining = false
  accountVal = ''
  passwordVal = ''
  backPath = '/'
  autoLogin = false
  rememberPassword = false
  initialized = false
  firstGetedCaptcha = false;

  onInputChanged () {
    this.errSummary = ''
    this.errDetail = ''
  }

  autoLoginChanged (newVal, oldVal) {
    if (newVal === oldVal) {
      return
    }

    if (!this.initialized) {
      return
    }

    if (newVal) {
      this.rememberPassword = true
    }

    this.$db.set(this.$db.keys.autoLogin, newVal)
  }

  rememberPasswordChanged (newVal, oldVal) {
    if (newVal === oldVal) {
      return
    }

    if (!this.initialized) {
      return
    }

    if (!newVal) {
      this.autoLogin = false
    }

    this.$db.set(this.$db.keys.rememberPassword, newVal)
  }

  onGetCaptchaImage (image) {
  }

  onGetCaptcha (code, err, data) {
    this.loadingCaptcha = false
    if (code === 0) {
      this.captchaId = data.id
      this.rsaPublicKey = data.rsaPublicKey
      this.captchaRequired = data.required
      this.onGetCaptchaImage(data.value)

      if (this.firstGetedCaptcha === false) {
        this.firstGetedCaptcha = true
        this.doAutoLogin()
      }
    } else {
      this.onGetCaptchaImage('')
    }
  }

  getCaptcha () {
    const argument = {
      length: this.captchaLength,
      width: this.captchaWidth,
      height: this.captchaHeight
    }

    this.loadingCaptcha = true
    this.post(this.$uris.getCaptcha, argument, this.onGetCaptcha)
  }

  onPrelogin (account, password, captcha) {
    return true
  }

  onPostLogin (code, err, data) {

  }

  onLoginInterceptor (response) {
    if (response.data) {
      if (response.data.code === 0) {
        let host = this.$net.getHost(response.request.responseURL)
        if (this.isNullOrEmpty(host)) {
          if (response.config) {
            host = this.$net.getHost(response.config.baseURL)
          }
        }
        if (this.isNullOrEmpty(host)) {
          host = document.location.host
        }
        this.$db.set(this.$db.keys.host, host)
      }
    }

    return response
  }

  onLogin (code, err, data) {
    this.logining = false
    this.errSummary = ''
    this.errDetail = ''
    if (code === 0) {
      this.$db.set(this.$db.keys.token, data.token)
      this.$db.set(this.$db.keys.account, data.account)
      this.$db.set(this.$db.keys.name, data.name)
      this.$db.set(this.$db.keys.password, this.passwordVal, true)
      this.$db.set(this.$db.keys.authorized, true)

      this.to(this.backPath)
    } else {
      this.errSummary = err.summary
      this.errDetail = err.detail
      this.$db.set(this.$db.keys.authorized, false)
      this.getCaptcha()
    }

    this.onPostLogin(code, err, data)
  }

  login () {
    const accountVal = this.accountVal.trim()
    const passwordVal = this.passwordVal
    const captchaVal = this.captchaVal.trim()
    if (!this.onPrelogin(accountVal, passwordVal, captchaVal)) {
      return
    }

    let pwdType = ''
    let pwdVal = passwordVal
    if (this.isNotNullOrEmpty(this.rsaPublicKey)) {
      const jsEncrypt = new JsEncrypt()
      jsEncrypt.setPublicKey(this.rsaPublicKey)
      pwdVal = jsEncrypt.encrypt(passwordVal)
      pwdType = 'rsa'
    }

    const argument = {
      account: accountVal,
      password: pwdVal,
      captchaId: this.captchaId,
      captchaValue: captchaVal,
      encryption: pwdType
    }

    this.errSummary = ''
    this.errDetail = ''
    this.logining = true
    this.$net.post(this.$uris.login, argument, this.onLogin, this.onLoginInterceptor)
  }

  doAutoLogin () {
    if (this.autoLogin !== true) {
      return
    }
    if (this.captchaRequired) {
      return
    }

    this.login()
  }

  mounted () {
    const authorized = this.$db.authorized()
    if (authorized) {
      this.to('/')
      return
    }

    if (this.$route.params.backPath) {
      this.backPath = this.$route.params.backPath
    }

    const account = this.$db.get(this.$db.keys.account)
    if (this.isNotNullOrEmpty(account)) {
      this.accountVal = account
    }

    const rememberPassword = this.$db.get(this.$db.keys.rememberPassword)
    if (rememberPassword === true) {
      const password = this.$db.get(this.$db.keys.password, true)
      if (this.isNotNullOrEmpty(password)) {
        this.passwordVal = password
      }

      this.rememberPassword = true
    }
    const autoLogin = this.$db.get(this.$db.keys.autoLogin)
    if (autoLogin === true) {
      this.autoLogin = autoLogin
    }

    this.getCaptcha()

    this.initialized = true
  }
}

export default LoginBase
</script>
