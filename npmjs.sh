#!/bin/bash

# cd ./common-ts || exit
# npm publish
# echo -n "d3-common published"

cd ./airlock/airlock-js || exit
npm publish
echo -n "airlock-js published"

cd ../moonbase || exit
npm publish
echo -n "moonbase-js published"