const process = require('process');
const cp = require('child_process');
const path = require('path');


describe.only('index.js', () => {
  beforeEach(() => {
    delete process.env["INPUT_PATHS"]
  })

  test('exists with error on missing input', async () => {
    const actionFile = path.join(getSrcRoot(), 'index.js');

    let err;

    try {
      await toPromise(cp.exec, `node ${actionFile}`, { env: process.env })
    } catch (error) {
      err = error
    }

    expect(err && err.code).toBe(1)
  })

  test('exists with error on invalid input (array)', async () => {
    process.env['INPUT_PATHS'] = []
    const actionFile = path.join(getSrcRoot(), 'index.js');

    let err;

    try {
      await toPromise(cp.exec, `node ${actionFile}`, { env: process.env })
    } catch (error) {
      err = error
    }

    expect(err && err.code).toBe(1)
  })

  test('exists with error on invalid input (empty string)', async () => {
    process.env['INPUT_PATHS'] = ''
    const actionFile = path.join(getSrcRoot(), 'index.js');

    let err;

    try {
      await toPromise(cp.exec, `node ${actionFile}`, { env: process.env })
    } catch (error) {
      err = error
    }

    expect(err && err.code).toBe(1)
  })

  test('exists 0 on valid input', async () => {
    process.env['INPUT_PATHS'] = '/common /shared'
    const actionFile = path.join(getSrcRoot(), 'index.js');
    let err

    try {
      await toPromise(cp.exec, `node ${actionFile}`, { env: process.env })
    } catch (error) {
      err = error
    }

    expect(err).toBe(undefined)
  })

  // shows how the runner will run a javascractionFilet action with env / stdout protocol
  test('log action run', async () => {
    process.env['INPUT_PATHS'] = '/common'
    const actionFile = path.join(getSrcRoot(), 'index.js');
    console.log(cp.execSync(`node ${actionFile}`, { env: process.env }).toString());
  })
})


function getSrcRoot() {
  return path.resolve(process.cwd(), 'src')
}

function toPromise(fn, ...args) {
  return new Promise((resolve, reject) => {
    fn(...args, (err, res) => {
      if (err) return reject(err)
      return resolve(res)
    })
  })
}