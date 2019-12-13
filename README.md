# Has Changed Path - Github Action

This action outputs whether a path or combination of paths has changed in the previous commit.

It solves a common issue among monorepo setups: conditional actions. Deploying a project that did not change in the previous commit could be a waste of time and resources.

With this action, **you know if a deployment or any other job needs to run based on the changed paths of the most recent commit.**

It differs from [Github's paths](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/workflow-syntax-for-github-actions#onpushpull_requestpaths) as our action is meant to be used inside your jobs, not at the root of your workflow file (see [this issue](https://github.community/t5/GitHub-Actions/Path-filtering-for-jobs-and-steps/td-p/33617)).

A good place to put it is in a workflow that runs on every push to `master`, as it will run on pull request merges.

## Inputs

- `paths` (required): Paths to detect changes.

## Outputs

- `changed`: boolean indicating if the paths were changed in previous commit

## Example workflows

### Important info:

Notice that **you must configure `fetch-depth` in your `actions/checkout@v2`**. That's because their default option now is to fetch only the latest commit instead of all history ([more info](https://github.com/actions/checkout)) 

If you want to fetch all history, pass `fetch-depth: 0`.

For monorepo packages, where history tends to be larger than single repos, it may take a while fetching all of it. That's why we used `fetch-depth: 100` in the examples. It will fetch the latest 100 commits.

### Detecting a simple one-path change:

```
name: Conditional Deploy

on: push

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v2
      with:
        fetch-depth: 100

    - uses: marceloprado/has-changed-path@v1
      id: changed-front
      with:
        paths: packages/front

    - name: Deploy front
      if: steps.changed-front.outputs.changed == 'true'
      run: /deploy-front.sh
```

### Detecting changes in multiple paths:

Useful when you have dependencies between packages (eg. /common package used in /front and /server).
Below, the output would be truthy for any given change inside `packages/front` **or** `packages/common`.

```
name: Conditional Deploy

on: push

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v2
      with:
        fetch-depth: 100

    - uses: marceloprado/has-changed-path@v1
      id: changed-front
      with:
        paths: packages/front packages/common

    - name: Deploy front
      if: steps.changed-front.outputs.changed == 'true'
      run: /deploy-front.sh
```

## How it works?

The action itself is pretty simple - take a look at `entrypoint.sh` ;) .

Basically, the latest commit SHA is compared with the latest commit in path. If they're the same, it means the path was changed at this commit and the action output is `true`.

To get the lastest commit in path, we're using `git log -1 --format=format:%H --full-diff $PATHS_TO_SEARCH`.

## Contribute

Have any thoughts or suggestions? Please, open an issue and I'll be happy to improve this action!