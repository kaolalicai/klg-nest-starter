#!/bin/bash -e

for d in sample/*/ ; do
    echo "$d"
    cd "$d"
    ncu -u && npm i && npm run test:e2e || exit $?
    cd ../../
done
