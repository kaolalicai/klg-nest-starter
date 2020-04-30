#!/bin/bash -e

for d in sample/*/ ; do
    echo "$d"
    cd "$d"
    npm run test:e2e || exit $?
    cd ../../
done
