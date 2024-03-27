#!/bin/bash

# cd ./artifacts-ts || exit
# npm publish
# echo -n "d3-artifacts published"

cd ./airlock/airlock-ts || exit
npm publish
echo -n "airlock-js published"

cd ../moonbase || exit
npm publish
echo -n "moonbase-js published"