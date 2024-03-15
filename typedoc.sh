#!/bin/bash

rm -f -R docs-json

npx typedoc \
    --gitRemote https://github.com/d3conomy/moonbase \
    --gitRevision setup \
    --plugin typedoc-plugin-inline-sources \
    --plugin typedoc-plugin-coverage \
    --cleanOutputDir \
    --json docs-json/moonbase.json \
    --options moonbase/typedoc.json \
    --validation.invalidLink false

npx typedoc \
    --entryPointStrategy merge "docs-json/*.json"

echo docs.d3conomy.com > docs/CNAME

rm -f -R docs-json