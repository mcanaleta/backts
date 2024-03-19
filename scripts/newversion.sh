#! /bin/sh

set -e
set -x


pnpm run build
# Array of package names
base_path="packages"

packages=("common" "server" "client" "utils")

# Function to check changes, update version, and publish
update_and_publish() {
    local package_name=$1
    cd "${base_path}/${package_name}"

    # Check if there are changes in the package directory since the last commit
    git status --porcelain .    
    if git status --porcelain . | grep -q .; then
        echo "CHANGES in ${package_name}"
        npm version patch
        git add .
        git commit -m "new version of ${package_name}"
        pnpm publish --access public
    fi

    # Return to the root directory
    cd ../../
}

# Iterate over each package and apply updates if necessary
for package in "${packages[@]}"; do
    update_and_publish "${package}"
done

echo "Version updates and publishing completed where necessary."
