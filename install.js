const path = require('path')
const fs = require('fs')
const { execSync } = require('child_process')
const AutoLaunch = require('easy-auto-launch')
const cliSelect = require('cli-select')
const configExample = require('./config.example.json')
const pkill = require('./pkill')

async function dns(dnsLocal) {
  console.log('🖥️  setup dns service in os network...')

  let connection = null

  if (process.platform === 'win32') {
    const conSeed = execSync('netsh interface ip show interfaces').toString()

    console.log('\n📡 select connection for auto setup dns:')
    try {
      const select = await cliSelect({
        values: conSeed
          .replace(/[\s\S]*---/, '')
          .trim().split('\n')
          .map((con) => con.replace(/^.* +? /, '').trim()),
      })
      connection = select.value

      console.log('📡 connection:', connection)
    } catch (err) {
      process.exit(1)
    }
  } else if (process.platform === 'linux') {
    const conSeed = execSync('ls /etc/NetworkManager/system-connections --format single-column').toString()

    console.log('\n📡 select connection for auto setup dns:')
    try {
      const select = await cliSelect({ values: conSeed.trim().split('\n').map((con) => path.basename(con, path.extname(con))) })
      connection = select.value

      console.log('📡 connection:', connection)
    } catch (err) {
      process.exit(1)
    }
  }

  if (process.platform === 'win32') {
    console.log('\n🔓 need administrator permission for auto setup primary dns in connection...\n   you may exit and setup it manually...'
    + `\n\ndns: [${dnsLocal}]\n`)
    execSync(
      `Start-Process "netsh" "interface ip set dns ""${connection}"" static ${dnsLocal}" -Verb runAs`,
      { stdio: 'ignore', shell: 'powershell.exe' },
    )
  } else if (process.platform === 'linux') {
    connection = connection.replace(/ /g, '\\ ')
    console.log('\n🔓 need root for auto setup primary dns in connection...\n   you may exit and setup it manually...'
    + `\n\ndns: [${dnsLocal}]\n`)

    execSync(
      'sudo sed -i -e \':a\' -e \'N\' -e \'$!ba\' -e "s|dns=.*;\\n||g"'
      + ` /etc/NetworkManager/system-connections/${connection}.nmconnection &&`
      + ' sudo sed -i -e \':a\' -e \'N\' -e \'$!ba\' -e "s|ignore-auto-dns=true\\n||g"'
      + ` /etc/NetworkManager/system-connections/${connection}.nmconnection &&`
      + ` sudo sed -i -e ':a' -e 'N' -e '$!ba' -e "s|\\[ipv4\\]|[ipv4]\\nignore-auto-dns=true\\ndns=${dnsLocal};|g"`
      + ` /etc/NetworkManager/system-connections/${connection}.nmconnection &&`
      + ' sudo service network-manager restart',
      { stdio: 'inherit', stdin: 'inherit' },
    )
  }
}

function run({ cwd, autoStartFile }) {
  console.log('🚀 launch process:', autoStartFile)

  if (process.platform === 'win32') {
    execSync(`Start-Process -WindowStyle hidden -FilePath ${autoStartFile} -WorkingDirectory ${cwd}`, {
      cwd, stdio: 'ignore', shell: 'powershell.exe',
    })
  } else if (process.platform === 'linux') {
    execSync(`${autoStartFile} &`, { cwd, stdio: 'ignore', detached: true })
  }
}

async function install(isForce = false) {
  console.log('👀 detect platform:', process.platform)

  if (process.platform !== 'win32' && process.platform !== 'linux') {
    console.error('❌ os system is not supported:', process.platform)
    process.exit(1)
  }

  const homedir = require('os').homedir()
  const folder = path.join(homedir, '.dev-dns')

  console.log('📁 making folder:', folder)

  fs.mkdirSync(folder, { recursive: true })

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

  try {
    console.log('📁 copy file:', targetExec)
    fs.cpSync(execPath, targetExec)
  } catch (err) {
    if (isForce) {
      console.log('🔥 force install service')
      await pkill.pkill({ exe })
      fs.copyFileSync(execPath, targetExec)
    } else {
      console.error('❌ server already running:', err.message)
      process.exit(1)
    }
  }

  const config = path.join(folder, 'config.json')

  if (fs.existsSync(config)) {
    console.log('🔧 skip config file, already exist:', config)
  } else {
    console.log('🔧 setup default config file:', config)
    fs.writeFileSync(config, JSON.stringify(configExample, null, 2))
  }

  console.log('🌐 default primary dns:', configExample.dns.primary)

  console.log('🚗 setup autostart...')

  const autoLaunch = new AutoLaunch({
    name: appName,
    path: targetExec,
  })

  const enabled = await autoLaunch.isEnabled()
  if (enabled) {
    await autoLaunch.disable()
  }

  // fix easy-auto-launch to background mode
  if (process.platform === 'win32') {
    const Winreg = require('winreg')

    const regKey = new Winreg({
      hive: Winreg.HKCU,
      key: '\\Software\\Microsoft\\Windows\\CurrentVersion\\Run',
    })

    autoLaunch.api.enable = function enable() {
      return new Promise((resolve, reject) => {
        const pathToAutoLaunchedApp = targetExec

        // fix for auto launch in background mode
        return regKey.set(appName, Winreg.REG_SZ,
          // eslint-disable-next-line max-len
          `"C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" Start-Process -WindowStyle hidden -FilePath "${pathToAutoLaunchedApp}"`,
          (err) => {
            if (err != null) { return reject(err) }
            return resolve()
          })
      })
    }
  }

  await autoLaunch.enable()

  run({
    cwd: folder,
    autoStartFile: targetExec,
  })

  await dns(configExample.host)
}

module.exports = {
  install,
}
