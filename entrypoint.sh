#!/bin/sh -l
set -euo pipefail

SOURCE=${SOURCE:-.}

cd ${GITHUB_WORKSPACE:-.}/${SOURCE}

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

# 3. Compares paths from latest HEAD with previous one. 
# --quiet: exits with 1 if there were differences (https://git-scm.com/docs/git-diff)
if git diff --quiet HEAD~1 HEAD -- $PATHS_TO_SEARCH; then
    echo "Code in the following paths hasn't changed: " $PATHS_TO_SEARCH
    echo ::set-output name=changed::false
    exit 0
else
    echo "Code in the following paths changed: " $PATHS_TO_SEARCH
    echo ::set-output name=changed::true
    exit 0
fi