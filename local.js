async function init(config) {
  const table = {}

  Object.entries(config)
    .forEach(([hostOrGroup, ipOrObj]) => {
      if (typeof ipOrObj === 'string' || ipOrObj instanceof String) {
        table[hostOrGroup] = ipOrObj
      } else {
        Object.entries(ipOrObj)
          .forEach(([host, ip]) => {
            table[host] = ip
          })
      }
    })

  const resolver = {
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
