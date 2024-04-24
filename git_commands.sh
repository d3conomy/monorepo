#!/bin/sh

git add .
git commit -m "${1}"

BRANCH=${2:-setup}

# Git commands for monorepo

# git subtree split --prefix=common/artifacts-ts --branch artifacts-ts
# git subtree split --prefix=airlock/airlock-react --branch airlock-react
# git subtree split --prefix=airlock/airlock-ts --branch airlock-ts
git subtree split --prefix=airlock --branch airlock
git subtree split --prefix=moonbase --branch moonbase

# Push all changes to remote
git push https://github.com/d3conomy/airlock "airlock:${BRANCH}"
git push https://github.com/d3conomy/moonbase "moonbase:${BRANCH}"
git push origin main