#! /bin/sh

set -e
set -x


pnpm run build
# Array of package names
packages=("common" "server" "client" "utils")

# Function to check changes, update version, and publish
update_and_publish() {
    local package_name=$1
    cd "packages/${package_name}"

    # Check if there are changes in the package
    if [[ -n $(git status -s) ]]; then
        # If changes exist, patch version, commit, and publish
        npm version patch
        git add .
        git commit -m "new version of ${package_name}"
        pnpm publish
    else
        echo "No changes in ${package_name}, skipping."
    fi

    # Return to the root directory
    cd ../..
}

# Iterate over each package and apply updates if necessary
for package in "${packages[@]}"; do
    update_and_publish "${package}"
done

echo "Version updates and publishing completed where necessary."
