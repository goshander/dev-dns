const path = require('path')
const fs = require('fs')
const AutoLaunch = require('easy-auto-launch')
const pkill = require('./pkill')

async function uninstall() {
  console.log('👀 detect platform:', process.platform)

  if (process.platform !== 'win32' && process.platform !== 'linux') {
    console.error('❌ os system is not supported:', process.platform)
    process.exit(1)
  }

  const homedir = require('os').homedir()
  const folder = path.join(homedir, '.dev-dns')

  let execPath = process.execPath

  if (
    execPath.endsWith('nodejs')
    || execPath.endsWith('node')
    || execPath.endsWith('nodejs.exe')
    || execPath.endsWith('node.exe')
  ) {
    if (process.platform === 'win32') {
      execPath = './dist/dev-dns-win.exe'
    } else if (process.platform === 'linux') {
      execPath = './dist/dev-dns-linux'
    }
  }

  const exe = path.basename(execPath)
  const appName = path.basename(exe, path.extname(exe))
  const targetExec = path.join(folder, exe)

  console.log('🗑️  kill process:', exe)
  await pkill.pkill({ exe })

  console.log('📂 remove folder:', folder)
  fs.rmdirSync(folder, { recursive: true })

  console.log('🚗 remove autostart...')

  const autoLaunch = new AutoLaunch({
    name: appName,
    path: targetExec,
  })

  const enabled = await autoLaunch.isEnabled()
  if (enabled) {
    await autoLaunch.disable()
  }
}

module.exports = {
  uninstall,
}
