#!/bin/sh

git add .
git commit -m "${1}"

# Git commands for monorepo
git subtree split --prefix=airlock --branch airlock
git subtree split --prefix=moonbase --branch moonbase

# Push all changes to remote
git push https://github.com/d3conomy/airlock airlock:setup
git push https://github.com/d3conomy/moonbase moonbase:setup