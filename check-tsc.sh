#!/bin/bash
# Just check exit code
./node_modules/.bin/tsc --noEmit --pretty false 1>/dev/null 2>/dev/null
echo $? > tsc-exit-code.txt
echo "DONE"
