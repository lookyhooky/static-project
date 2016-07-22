/**
 * Spawn brew installed tidy
 */

const spawn = require('child_process').spawn

module.exports = function (str, callback) {
  let buffer = ''
  let error = ''

  if (!callback) {
    throw new Error('No callback provided for tidy')
  }

  const tidy = spawn('/usr/local/bin/tidy', ['-config', 'tidy.config.txt', '-quiet'])

  tidy.stdout.on('data', function (data) {
    buffer += data
  })

  tidy.stderr.on('data', function (data) {
    error += data
  })

  tidy.on('close', function (code) {
    if (code !== 0) {
      console.log('The tidy child process exited with code ' + code)
    }

    callback(error, buffer)
  })

  tidy.stdin.write(str)
  tidy.stdin.end()
}
