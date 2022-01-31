function help() {
  console.log('📖 dev-dns server doc:')
  console.log('- `dev-dns` - start server')
  console.log('- `dev-dns --help` - show this doc')
  console.log('- `dev-dns --install` - auto install script')
  console.log('- `dev-dns --install --force` - auto install script with force close for update')
  console.log('- `dev-dns --uninstall` - auto uninstall script')
  console.log('- `dev-dns --run` - run in detached mode')
}

module.exports = {
  help,
}
