const core = require("@actions/core");
const github = require("@actions/github");

const hasChanged = require("./hasChanged");

async function run() {
  try {
    const paths = core.getInput("paths", { required: true });
    core.info("Checking the following paths for changes:");
    for (const path of paths.split(" ")) {
      core.info("  " + path);
    }
    const isPullRequest = github.context.eventName === "pull_request";
    console.log(`GitHub Action event name: ${github.context.eventName}`);
    console.log(`Triggered by pull request? ${isPullRequest}`);

    let targetBranch;
    if (isPullRequest) {
      targetBranch = github.context.payload.pull_request.base.ref;
      core.info(`Comparing to pull request target branch: ${targetBranch}`);
    }
    const changed = await hasChanged(paths, targetBranch);

    if (changed) {
      core.info(`Code in the following paths changed: ${paths}`);
    } else {
      core.info(`Code in the following paths hasn't changed: ${paths}`);
    }

    core.setOutput("changed", changed);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
