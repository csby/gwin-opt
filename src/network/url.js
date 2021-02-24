import Meta from '../meta'

function getUrl () {
  return Meta.getAttribute('api')
}

function getHost (url) {
  let host = ''
  if (url) {
    const start = url.indexOf('//')
    if (start !== -1) {
      const from = start + 2
      const end = url.indexOf('/', from)
      if (end !== -1) {
        host = url.substring(start + 2, end)
      } else {
        host = url.substring(start + 2)
      }
    }
  }

  return host
}

export default {
  getUrl,
  getHost
}
