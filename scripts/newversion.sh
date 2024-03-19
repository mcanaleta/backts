#! /bin/sh

set -e
set -x

# Check if git repository is clean
if [[ -n $(git status -s) ]]; then
    echo "Error: Git repository is not clean"
    exit 1
fi



pnpm run build
cd packages/common
npm version patch
cd ../server
npm version patch
cd ../client
npm version patch
cd ../..
git add .
git commit -m "new version"
cd packages/common
pnpm publish
cd ../server
pnpm publish
cd ../client
pnpm publish
cd ../..

echo "New version published, ready to push"
