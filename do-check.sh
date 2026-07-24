#!/bin/sh
npx tsc --noEmit > tsc-output.txt 2>&1
echo "TSC_EXIT=$?" > tsc-exit.txt
npx vite build > build-output.txt 2>&1
echo "BUILD_EXIT=$?" > build-exit.txt
echo "ALL_DONE"
