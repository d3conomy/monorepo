#!/bin/bash

cd ./airlock/airlock-js || exit
npm publish
echo -n "airlock-js published"

cd ../moonbase || exit
npm publish
echo -n "moonbase-js published"