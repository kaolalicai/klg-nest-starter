#!/bin/bash -e

for d in sample/*/ ; do
    echo "$d"
    cd "$d"
    ncu @kalengo/keycloak @kalengo/web @kalengo/mongoose @kalengo/redis @kalengo/util -u && npm i || exit $?
    cd ../../
done
