
const core = require('@actions/core');

const hasChanged = require('./hasChanged');

async function run() {
  try {
    const paths = core.getInput('paths', { required: true });
    const commits = parseInt(core.getInput('commits', { required: false, trimWhitespace: true }) || "1", 10);
    const changed = await hasChanged(paths, commits)

    if (changed) {
      core.info(`Code in the following paths changed: ${paths}`)
    } else {
      core.info(`Code in the following paths hasn't changed: ${paths}`)
    }

    core.setOutput('changed', changed)
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
