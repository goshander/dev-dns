const { execSync } = require('child_process')

async function pkill({ exe }) {
  if (process.platform === 'win32') {
    // TODO win32 kill process
  } else if (process.platform === 'linux') {
    try {
      execSync(`pkill -o ${exe}`, { stdio: 'ignore' })
      await new Promise((resolve) => {
        setTimeout(() => { resolve(true) }, 100)
      })
    } catch (err) {
      // pass
    }
  }
}

module.exports = {
  pkill,
}
