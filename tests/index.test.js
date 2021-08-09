const process = require('process');
const path = require('path');
const cp = require('child_process');

const exec = require('@actions/exec');

const execOpts = { env: process.env, ignoreReturnCode: true, silent: true };

describe('index.js', () => {
  beforeEach(() => {
    delete process.env['INPUT_PATHS'];
  });

  test('exists with error on missing input', async () => {
    const actionFile = path.join(getSrcRoot(), 'index.js');

    const returnCode = await exec.exec('node', [actionFile], execOpts);
    expect(returnCode).toBe(1);
  });

  test('exists with error on invalid input (array)', async () => {
    process.env['INPUT_PATHS'] = [];
    const actionFile = path.join(getSrcRoot(), 'index.js');

    const returnCode = await exec.exec('node', [actionFile], execOpts);
    expect(returnCode).toBe(1);
  });

  test('exists with error on invalid input (empty string)', async () => {
    process.env['INPUT_PATHS'] = '';
    const actionFile = path.join(getSrcRoot(), 'index.js');

    const returnCode = await exec.exec('node', [actionFile], execOpts);
    expect(returnCode).toBe(1);
  });

  test('exists 0 on valid input', async () => {
    process.env['INPUT_PATHS'] = 'src/ tests/';
    const actionFile = path.join(getSrcRoot(), 'index.js');

    const returnCode = await exec.exec('node', [actionFile], execOpts);
    expect(returnCode).toBe(0);
  });

  // shows how the runner will run a JS action with env / stdout protocol
  test('log action run', (done) => {
    process.env['INPUT_PATHS'] = 'common/';
    const actionFile = path.join(getSrcRoot(), 'index.js');

    cp.exec(`node ${actionFile}`, { env: process.env }, (err, res) => {
      if (err) {
        console.log(err);
      }

      expect(err).toBe(null);

      console.log(res.toString());

      done();
    });
  });
});

function getSrcRoot() {
  return path.resolve(process.cwd(), 'src');
}
