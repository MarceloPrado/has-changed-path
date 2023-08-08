const exec = require('@actions/exec')

async function main(pathsToSearch = '', commits = '') {
  throwsForInvalidPaths(pathsToSearch)

  return hasChanged(pathsToSearch, commits)
}

function throwsForInvalidPaths(pathsToSearch) {
  if (pathsToSearch && typeof pathsToSearch === 'string') return
  throw new Error('pathsToSearch needs to be a string')
}

function getCWD() {
  const { GITHUB_WORKSPACE = '.', SOURCE = '.' } = process.env
  return `${GITHUB_WORKSPACE}/${SOURCE}`
}

async function hasChanged(pathsToSearch, commits = 1) {
  const paths = pathsToSearch.split(' ')

  //  --quiet: exits with 1 if there were differences (https://git-scm.com/docs/git-diff)
  const exitCode = await exec.exec('git', [
    'diff',
    '--quiet',
    'HEAD~' + commits,
    'HEAD',
    '--',
    ...paths,
  ], {
    ignoreReturnCode: true,
    silent: false,
    cwd: getCWD()
  })

  const pathsChanged = exitCode === 1

  return pathsChanged
}

module.exports = main
