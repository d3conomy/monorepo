#!/bin/bash

rm -f -R docs-json

npx typedoc \
    --plugin typedoc-plugin-inline-sources \
    --json docs-json/moonbase.json \
    --options moonbase/typedoc.json \
    --validation.invalidLink false

npx typedoc \
    --plugin typedoc-plugin-inline-sources \
    --json docs-json/airlock-react.json \
    --options airlock/airlock-react/typedoc.json \
    --validation.invalidLink false

npx typedoc \
    --gitRemote github.com/d3conomy/monorepo.git \
    --gitRevision main \
    --plugin typedoc-plugin-inline-sources \
    --cleanOutputDir \
    --entryPointStrategy merge "docs-json/*.json"

echo docs.d3conomy.com > docs/CNAME

rm -f -R docs-json