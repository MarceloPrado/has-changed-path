
function hasChanged(pathsToSearch = '') {
  return new Promise((resolve, reject) => {
    try {
      throwsForInvalidPaths(pathsToSearch)
      resolve()

    } catch (error) {
      reject(error)
    }
  })
}

function throwsForInvalidPaths(pathsToSearch) {
  if (pathsToSearch && typeof pathsToSearch === 'string') return
  throw new Error('pathsToSearch needs to be a string')
}

module.exports = hasChanged