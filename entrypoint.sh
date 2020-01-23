#!/bin/sh -l
set -euo pipefail

source=${SOURCE:-.}

cd ${GITHUB_WORKSPACE}/${source}

# This script returns `true` if the paths passed as
# arguments were changed in the last commit.

# For reference:
# https://fant.io/p/circleci-early-exit/

# 1. Get all the arguments of the script
# https://unix.stackexchange.com/a/197794
PATHS_TO_SEARCH="$*"

# 2. Make sure the paths to search are not empty
if [ -z "$PATHS_TO_SEARCH" ]; then
    echo "Please provide the paths to search for."
    echo "Example usage:"
    echo "./entrypoint.sh path/to/dir1 path/to/dir2"
    exit 1
fi

# 3. Get the latest commit
LATEST_COMMIT=$(git rev-parse HEAD)

# 4. Get the latest commit in the searched paths
LATEST_COMMIT_IN_PATH=$(git log -1 --format=format:%H --full-diff $PATHS_TO_SEARCH)

if [ $LATEST_COMMIT != $LATEST_COMMIT_IN_PATH ]; then
    echo "Code in the following paths has not changed:"
    echo $PATHS_TO_SEARCH
    echo ::set-output name=changed::false
    exit 0
fi

echo ::set-output name=changed::true
exit 0