const prefix = {
  local: 'evt-local-',
  websocket: 'evt-ws-'
}

const local = {
  // 发送websocket消息: (id, data)
  socket: lkey('socket'),
  // 登录系统: ()
  login: lkey('login'),
  // 退出登录: ()
  logout: lkey('logout')
}

const websocket = {
  // 通知: (id, data)
  notify: wkey('notify')
}

function lkey (v) {
  return prefix.local + v
}

function wkey (v) {
  return prefix.websocket + v
}

export default {
  local,
  websocket
}
