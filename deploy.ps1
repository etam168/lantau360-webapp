param (
    [string]$BuildMode = "staging"
)

# Define the credentials
$remoteUsername = "root"
$remoteHost = "97.74.95.249"
$stagingPath = "/home/host1/domains/app-dev.lantau360.com/public_html"
$productionPath = "/home/host1/domains/app.lantau360.com/public_html"

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

# Check if the build was successful
if ($LASTEXITCODE -eq 0) {
    Write-Host "Build completed successfully."
    
    # Use scp to upload files from the dist folder to the remote server
    $SCPCommand = "scp -r -C ${DistFolder}/* ${remoteUsername}@${remoteHost}:${remotePath}"
    Write-Host "Running SCP command: $SCPCommand"
    Invoke-Expression $SCPCommand
    
    # Check if the SCP command was successful
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Files uploaded successfully to ${remoteUsername}@${remoteHost}:${remotePath}"
    }
    else {
        Write-Host "Failed to upload files. SCP command exited with code: $LASTEXITCODE"
    }
}
else {
    Write-Host "Build failed. Exiting script."
}