import Key from './key'

const keys = Key.keys
const clearKeys = Key.clearKeys

function set (k, v, encrypted = false) {
  const item = {
    e: encrypted,
    v: v
  }
  if (encrypted === true) {
    item.v = window.btoa(v)
  }
  localStorage.setItem(k, JSON.stringify(item))
}

function get (k) {
  const v = localStorage.getItem(k)
  if (v) {
    try {
      const item = JSON.parse(v)
      if (item.e === true) {
        return window.atob(item.v)
      } else {
        return item.v
      }
    } catch (err) {
      console.log(err)
    }
  }

  return null
}

function remove (k) {
  localStorage.removeItem(k)
}

function clear () {
  for (let i = 0; i < clearKeys.length; i++) {
    localStorage.removeItem(clearKeys[i])
  }
}

function authorized () {
  const v = get(keys.authorized)
  if (v === true) {
    return true
  }
  return false
}

export default {
  keys,
  authorized,
  set,
  get,
  remove,
  clear
}
