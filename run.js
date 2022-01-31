const path = require('path')
const fs = require('fs')
const { execSync, spawnSync } = require('child_process')
const configExample = require('./config.example.json')
const pkill = require('./pkill')

async function run(isForce = false) {
  console.log('👀 detect platform:', process.platform)

  if (process.platform !== 'win32' && process.platform !== 'linux') {
    console.error('❌ os system is not supported:', process.platform)
    process.exit(1)
  }

  const folder = path.dirname(process.execPath)

  let execPath = process.execPath

  if (
    execPath.endsWith('nodejs')
    || execPath.endsWith('node')
    || execPath.endsWith('nodejs.exe')
    || execPath.endsWith('node.exe')
  ) {
    if (process.platform === 'win32') {
      execPath = 'dev-dns-win.exe'
    } else if (process.platform === 'linux') {
      execPath = 'dev-dns-linux'
    }
  }

  const exe = path.basename(execPath)
  const targetExec = path.join(folder, exe)

  if (isForce) {
    console.log('🔥 force kill old service')
    await pkill.pkill({ exe })
  }

  const config = path.join(folder, 'config.json')

  if (fs.existsSync(config)) {
    console.log('🔧 skip config file, already exist:', config)
  } else {
    console.log('🔧 setup default config file:', config)
    fs.writeFileSync(config, JSON.stringify(configExample, null, 2))
  }

  console.log('🌐 default primary dns:', configExample.dns.primary)

  console.log('🚀 launch process:', targetExec)
  const cwd = folder

  if (process.platform === 'win32') {
    execSync(`Start-Process -WindowStyle hidden -FilePath ${targetExec} -WorkingDirectory ${cwd}`, {
      cwd, stdio: 'ignore', shell: 'powershell.exe',
    })
  } else if (process.platform === 'linux') {
    execSync(`./${exe} /snapshot/dev_dns/server.js &`,
      {
        cwd,
        stdio: 'ignore',
        detached: true,
      })
  }
}

module.exports = {
  run,
}
