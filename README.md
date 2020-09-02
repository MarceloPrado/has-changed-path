# Has Changed Path - GitHub Action

<p align="left">
  <a href="https://github.com/MarceloPrado/has-changed-path/actions"><img alt="has-changed-path status" src="https://github.com/MarceloPrado/has-changed-path/workflows/unit-tests/badge.svg"></a>
</p>

This action outputs whether a path or combination of paths has changed in the previous commit.

It solves a common issue among monorepo setups: conditional actions. Deploying a project that did not change in the previous commit could be a waste of time and resources.

With this action, **you know if a deployment or any other job needs to run based on the changed paths of the most recent commit.**

It differs from [GitHub's paths](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/workflow-syntax-for-github-actions#onpushpull_requestpaths) as our action is meant to be used inside your job steps, not at the root of your workflow file (see [this issue](https://github.community/t5/GitHub-Actions/Path-filtering-for-jobs-and-steps/td-p/33617)).

My recommendation is to put this action in a workflow that runs on every push to `master`.

## Inputs

- `paths` (required): Path to detect changes. It's possible to pass one path, a combination or a wildcard. Valid options include: `packages/front`, `packages/front packages/shared`, `packages/**/tests`. See workflow examples below for more information.

## Outputs

- `changed`: boolean indicating if the paths changed at the latest commit

## Example workflows

### Important info:

Notice that **you must configure `fetch-depth` in your `actions/checkout@v2`**. That's because their default option now is to fetch only the latest commit instead of all history ([more info](https://github.com/actions/checkout))

If you want to fetch all history, pass `fetch-depth: 0`.

For monorepo packages, where history tends to be larger than single repos, it may take a while fetching all of it. That's why we used `fetch-depth: 100` in the examples. It will fetch the latest 100 commits.

### Detecting a simple one-path change:

```yaml
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

Useful when you have dependencies between packages (eg. `/common` package used in `/front` and `/server`).
Below, the output would be truthy for any given change inside `packages/front` **or** `packages/common`.

```yaml
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

### Detecting a one-path change with checkout multiple repos:

```yaml
name: Conditional Deploy

on: push

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2
        with:
          fetch-depth: 100
          path: main

      - uses: actions/checkout@v2
        with:
          fetch-depth: 100
          repsitory: my-org/my-tools
          path: my-tools

      - uses: marceloprado/has-changed-path@v1
        id: changed-main
        with:
          paths: packages/front
        env:
          SOURCE: main

      - uses: marceloprado/has-changed-path@v1
        id: changed-my-tools
        with:
          paths: somewhere/else
        env:
          SOURCE: my-tools

      - name: Deploy main
        if: steps.changed-main.outputs.changed == 'true'
        run: /deploy-main.sh

      - name: Deploy my tools
        if: steps.changed-my-tools.outputs.changed == 'true'
        run: /deploy-my-tools.sh
```

## How it works?

The action itself is pretty simple - take a look at `src/hasChanged.js` ;) .

Basically, we compare the latest HEAD with the previous one using `git diff` command. This allows us to effectively detect changes in most cases (squashed merges and merges with merge commit).

The algorithm works very similar with [Netlify's default way](https://community.netlify.com/t/monorepo-and-long-builds/7234/2) for detecting changes in monorepo builds.

## Contribute

Have any thoughts or suggestions? Please, open an issue and I'll be happy to improve this action!
