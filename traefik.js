const Docker = require('dockerode')
const isIp = require('is-ip')

let interval = null

const docker = new Docker()
let dockerError = false

async function update() {
  const table = {}
  let dockerHost = null

  try {
    dockerHost = await docker.getConfig().modem.host
  } catch (err) {
    if (!dockerError) {
      console.error('❌ error docker connection:', dockerHost, err.message)
      dockerError = true
    }
    return table
  }

  if (dockerHost == null || !(isIp(dockerHost))) {
    dockerHost = '127.0.0.1'
  }

  let containerList = []
  try {
    containerList = await docker.listContainers()
    if (dockerError) {
      console.log('🐋 docker connected:', dockerHost)
      dockerError = false
    }
  } catch (err) {
    if (!dockerError) {
      console.error('❌ error docker connection:', dockerHost, err.message)
      dockerError = true
    }
  }

  containerList.forEach(({ Labels }) => {
    Object.keys(Labels)
      .filter((label) => label.startsWith('traefik.http.routers') && label.endsWith('.rule'))
      .forEach((label) => {
        const rule = Labels[label]
        const host = [...rule.matchAll(/Host\(`([\d\w.-]+?)`\)/g)]
        host.forEach((h) => {
          if (h[1]) table[h[1]] = dockerHost
        })
      })
  })

  return table
}

async function init(refreshTime = 10000) {
  let table = await update()

  interval = setInterval(async () => {
    table = await update()
  }, refreshTime)

  const resolver = {
    close() {
      clearInterval(interval)
      interval = null
    },
    resolve(name) {
      if (table[name]) {
        return table[name]
      }
      return null
    },
  }

  return resolver
}

module.exports = {
  init,
}
