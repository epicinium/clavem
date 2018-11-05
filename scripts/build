#!/usr/bin/env sh

npx babel sources --out-dir releases --delete-dir-on-start

if [ "$TRAVIS" = true ]; then
    alias emcc="docker run --rm -v $(pwd):/src trzeci/emscripten emcc"
fi

emcc -Os sources/ed25519.c -o releases/binary.js -s EXPORTED_FUNCTIONS='["_malloc", "_free"]'

if [ "$NODE_ENV" = "production" ]; then
    find releases -iname "*.js" -exec sh -c "npx terser --toplevel --compress passes=2 --mangle --output {} -- {}" \;
else
    find releases -iname "*.js" -exec sh -c "npx terser --toplevel --compress --beautify --output {} -- {}" \;
fi
