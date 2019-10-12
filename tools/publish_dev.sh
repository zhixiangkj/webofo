#!/bin/bash
cd `dirname $0`
if [ ! -f "deploy.js" ]; then
    echo "where am I?"
    exit 1
fi
cd ..
npm install
npm run build
cd tools
node deploy_dev.js

