const fs = require('fs')
const { execSync } = require('child_process')

function hideWin32() {
  if (process.platform !== 'win32') return

  const powershellScript = `
  Add-Type -Name Window -Namespace Console -MemberDefinition '
  [DllImport("Kernel32.dll")]
  public static extern IntPtr GetConsoleWindow();

  [DllImport("user32.dll")]
  public static extern bool ShowWindow(IntPtr hWnd, Int32 nCmdShow);
  '

  $consolePtr = [Console.Window]::GetConsoleWindow()
  #0 hide
  [Console.Window]::ShowWindow($consolePtr, 0)
  `

  const workingDir = process.cwd()
  const tempFile = `${workingDir}\\hide.ps1`
  fs.writeFileSync(tempFile, powershellScript)

  execSync('type .\\hide.ps1 | powershell.exe -noprofile -', { stdio: 'inherit' })
  fs.unlinkSync(tempFile)
}

module.exports = {
  hideWin32,
}
