const { execSync } = require('child_process')

async function pkill({ exe }) {
  if (process.platform === 'win32') {
    const pList = execSync(`tasklist /FO csv /NH`).toString()
                .trim().split('\n')
                .map((p) => {
                  const pS = p.split(',')
                  return {name:pS[0].replace(/((^")|("$))/g,''), pid: parseInt(pS[1].replace(/((^")|("$))/g,''))}
                })

    const pid = pList.find((p)=>p.name === exe && p.pid !== process.pid)

    try {
      execSync(`taskkill /F /PID ${pid.pid}`, { stdio: 'ignore' })
    } catch (err) {
      // pass
    }
  } else if (process.platform === 'linux') {
    try {
      // TODO add current process pid check
      execSync(`pkill -o ${exe}`, { stdio: 'ignore' })
    } catch (err) {
      // pass
    }
  }
  await new Promise((resolve) => {
    setTimeout(() => { resolve(true) }, 100)
  })
}

module.exports = {
  pkill,
}
