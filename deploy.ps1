param (
    [string]$BuildMode = "staging"
)

# Define the credentials
$remoteUsername = "lantau360"
$remoteHost = "97.74.95.249"

# Define the home folder and paths
$homeFolder = "/home/lantau360"
$domainName = "lantau360.com"
$stagingPath = "${homeFolder}/domains/app-dev.${domainName}/public_html"
$productionPath = "${homeFolder}/domains/app.${domainName}/public_html"

# Set the build command and destination path based on the build mode
if ($BuildMode -eq "production") {
    $BuildCommand = "yarn build"
    $remotePath = $productionPath
}
else {
    $BuildCommand = "yarn build --mode staging"
    $remotePath = $stagingPath
}

$DistFolder = "dist"

# Run the build command
Write-Host "Running build command: $BuildCommand"
Invoke-Expression $BuildCommand

# Exit if the build failed
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed. Exiting script."
    exit $LASTEXITCODE
}

Write-Host "Build completed successfully."

# Construct the rsync command
$RSYNCCommand = "rsync -avz --delete ${DistFolder}/ ${remoteUsername}@${remoteHost}:${remotePath}"

# Convert Windows paths to WSL paths and run the rsync command based on the OS
if ($env:OS -eq "Windows_NT") {
    $DistFolder = wsl wslpath -a $DistFolder
    $RSYNCCommand = "rsync -avz --delete ${DistFolder}/ ${remoteUsername}@${remoteHost}:${remotePath}"
    Write-Host "Running rsync command in WSL: $RSYNCCommand"
    Invoke-Expression "wsl $RSYNCCommand"
}
else {
    Write-Host "Running rsync command: $RSYNCCommand"
    & /bin/bash -c $RSYNCCommand
}

# Check if the rsync command was successful
if ($LASTEXITCODE -eq 0) {
    Write-Host "Files uploaded successfully to ${remoteUsername}@${remoteHost}:${remotePath}"
}
else {
    Write-Host "Failed to upload files. rsync command exited with code: $LASTEXITCODE"
}
