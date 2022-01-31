const { execSync } = require('child_process')

async function pkill({ exe }) {
  let pCommand = ''

  if (process.platform === 'win32') {
    pCommand = 'tasklist /FO csv /NH'
  } else if (process.platform === 'linux') {
    pCommand = 'ps -e -o "%c,%p"'
  }

  const pList = execSync(pCommand)
    .toString()
    .trim().split('\n')
    .map((p) => {
      const pS = p.split(',')
      return { name: pS[0].replace(/((^")|("$))/g, '').trim(), pid: parseInt(pS[1].replace(/((^")|("$))/g, '').trim()) }
    })

  // ignore current run process
  const pid = pList.filter((p) => p.name.includes(exe) && p.pid !== process.pid)
  if (pid.length < 1) return

  pid.forEach((p) => {
    let kCommand = ''

    if (process.platform === 'win32') {
      kCommand = `taskkill /F /PID ${p.pid}`
    } else if (process.platform === 'linux') {
      kCommand = `kill -s 9 ${p.pid}`
    }

    try {
      execSync(kCommand, { stdio: 'ignore' })
    } catch (err) {
      // pass
    }
  })

  await new Promise((resolve) => {
    setTimeout(() => { resolve(true) }, 100)
  })
}

module.exports = {
  pkill,
}
