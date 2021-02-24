const prefix = 'opt'
const clearKeys = []

const keys = {
  // 接口主机: string
  host: key('host'),
  // 凭证: string
  token: key('token'),
  // 账号: string
  account: key('account', true),
  // 密码: string
  password: key('password', true),
  // 姓名: string
  name: key('name'),
  // 已授权: bool
  authorized: key('authorized'),
  // 自动登录: bool
  autoLogin: key('autoLogin', true),
  // 记住账号: bool
  rememberPassword: key('rememberPassword', true)
}

function key (v, reserved = false) {
  const key = prefix + v
  if (reserved === false) {
    clearKeys.push(key)
  }
  return key
}

export default {
  keys,
  clearKeys
}
