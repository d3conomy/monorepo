#!/bin/sh

git add .
git commit -m "${1}"

PROJECTS_BRANCH=${2:-setup}

MONOREPO_BRANCH=${3:-main}

# Git commands for monorepo

# git subtree split --prefix=common/artifacts-ts --branch artifacts-ts
# git subtree split --prefix=airlock/airlock-react --branch airlock-react
# git subtree split --prefix=airlock/airlock-ts --branch airlock-ts
git subtree split --prefix=airlock --branch airlock
git subtree split --prefix=moonbase --branch moonbase

# Push all changes to remote
git push https://github.com/d3conomy/airlock "airlock:${PROJECTS_BRANCH}"
git push https://github.com/d3conomy/moonbase "moonbase:${PROJECTS_BRANCH}"
git push origin "${MONOREPO_BRANCH}"