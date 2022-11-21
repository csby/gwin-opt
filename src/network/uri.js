const uri = {
  // 获取获取验证码
  getCaptcha: '/opt.api/captcha',
  // 用户登录
  login: '/opt.api/login',
  // 退出登录
  logout: '/opt.api/logout',
  // 获取登录账号
  getLoginAccount: '/opt.api/login/account',
  // 获取在线用户
  getOnlineUsers: '/opt.api/online/users',

  // 通知订阅
  websocketNotify: '/opt.api/websocket/notify',

  // 后台服务
  // 获取服务信息
  svcInfo: '/opt.api/service/info',
  // 是否可在线重启
  svcRestartEnable: '/opt.api/service/restart/enable',
  // 重启服务
  svcRestart: '/opt.api/service/restart',
  // 是否可在线更新
  svcUpdateEnable: '/opt.api/service/update/enable',
  // 更新服务
  svcUpdate: '/opt.api/service/update',

  // 更新管理
  // 是否支持
  updEnable: '/opt.api/update/enable',
  // 获取服务信息
  updInfo: '/opt.api/update/info',
  // 是否可在线重启
  updRestartEnable: '/opt.api/update/restart/enable',
  // 重启服务
  updRestart: '/opt.api/update/restart',
  // 是否可在线更新
  updUploadEnable: '/opt.api/update/upload/enable',
  // 更新服务
  updUpload: '/opt.api/update/upload',

  // 系统信息
  // 获取主机信息
  monitorHost: '/opt.api/monitor/host',
  // 获取网卡信息
  monitorNetworkInterfaces: '/opt.api/monitor/network/interfaces',
  // 获取监听端口
  monitorListenPorts: '/opt.api/monitor/network/listen/ports',

  // 网站管理
  // 根站点
  // 获取文件列表
  siteRootFileList: '/opt.api/site/root/file/list',
  // 上传文件
  siteRootFileUpload: '/opt.api/site/root/file/upload',
  // 删除文件
  siteRootFileDelete: '/opt.api/site/root/file/delete',
  // 应用站点
  // 获取网站列表(ID)
  siteWebAppList: '/opt.api/site/app/list',
  // 获取网站信息
  siteWebAppInfo: '/opt.api/site/app/info',
  // 上传网站
  siteWebAppUpload: '/opt.api/site/app/upload',

  // 服务设置
  // 获取接口配置
  svcSettingApi: '/opt.api/setting/api',

  // DHCP
  // 获取筛选器列表
  dhcpFilterList: '/api/dhcp/filter/list',
  // 添加筛选器
  dhcpFilterAdd: '/api/dhcp/filter/add',
  // 删除筛选器
  dhcpFilterDel: '/api/dhcp/filter/del',
  // 修改筛选器
  dhcpFilterMod: '/api/dhcp/filter/mod',
  // 获取地址租用列表
  dhcpLeaseList: '/api/dhcp/lease/list',

  // DNS
  // 解析A记录
  // 获取记录列表
  dnsRecordList: '/api/dns/record/list',
  // 添加记录
  dnsRecordAdd: '/api/dns/record/add',
  // 删除记录
  dnsRecordDel: '/api/dns/record/del',

  // SVN
  // 获取用户列表
  svnUserAllList: '/api/svn/user/all/list',
  // 新建存储库
  svnRepositoryAdd: '/api/svn/repository/new',
  // 获取存储库列表
  svnRepositoryList: '/api/svn/repository/list',
  // 获取文件夹列表
  svnFolderList: '/api/svn/folder/list',
  // 获取访问权限列表
  svnPermissionList: '/api/svn/permission/list',
  // 添加访问权限
  svnPermissionAdd: '/api/svn/permission/add',
  // 修改访问权限
  svnPermissionMod: '/api/svn/permission/mod',
  // 删除访问权限
  svnPermissionDel: '/api/svn/permission/del'
}

export default {
  uris: uri
}
