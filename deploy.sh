#!/bin/bash

# Default target
Target="${1:-staging}"

# Define the credentials
remoteUsername="lantau360"
remoteHost="97.74.95.249"

# Define the home folder and paths
homeFolder="/home/lantau360"
domainName="lantau360.com"
stagingPath="${homeFolder}/domains/app-dev.${domainName}/public_html"
productionPath="${homeFolder}/domains/app.${domainName}/public_html"

# Set the build command and destination path based on the build mode
if [ "$Target" == "production" ]; then
    BuildCommand="yarn build"
    remotePath="$productionPath"
else
    BuildCommand="yarn build --mode staging"
    remotePath="$stagingPath"
fi

DistFolder="dist"

# Run the build command
echo "Running build command: $BuildCommand"
eval $BuildCommand

# Check if the build was successful
if [ $? -eq 0 ]; then
    echo "Build completed successfully."

    # Determine the path to use for rsync
    if [ "$(uname -s)" == "Linux" ] && grep -q Microsoft /proc/version; then
        # Assume WSL
        DistFolderWSL=$(wslpath -a "$DistFolder")
        RSYNCCommand="rsync -avz --delete ${DistFolderWSL}/* ${remoteUsername}@${remoteHost}:${remotePath}"
        echo "Running rsync command: $RSYNCCommand"
        wsl $RSYNCCommand
    else
        # Assume macOS or native Linux
        RSYNCCommand="rsync -avz --delete ${DistFolder}/ ${remoteUsername}@${remoteHost}:${remotePath}"
        echo "Running rsync command: $RSYNCCommand"
        eval $RSYNCCommand
    fi

    # Check if the rsync command was successful
    if [ $? -eq 0 ]; then
        echo "Files uploaded successfully to ${remoteUsername}@${remoteHost}:${remotePath}"
    else
        echo "Failed to upload files. rsync command exited with code: $?"
    fi
else
    echo "Build failed. Exiting script."
fi
