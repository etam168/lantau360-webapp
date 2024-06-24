param (
    [string]$BuildMode = "staging"
)

# Define the credentials
$remoteUsername = "root"
$remoteHost = "103.15.20.214"

# Define the home folder and paths
$homeFolder = "/home/lantau360"
$domainName = "lantau360.biz"
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

# Check if the build was successful
if ($LASTEXITCODE -eq 0) {
    Write-Host "Build completed successfully."
    
    # Detect if the script is running on Windows or macOS
    if ($env:OS -eq "Windows_NT") {
        # Running on Windows
        # Convert Windows paths to WSL paths
        $DistFolderWSL = wsl wslpath -a $DistFolder
        
        # Use rsync within WSL
        $RSYNCCommand = "rsync -avz --delete ${DistFolderWSL}/* ${remoteUsername}@${remoteHost}:${remotePath}"
        Write-Host "Running rsync command: $RSYNCCommand"
        Invoke-Expression "wsl $RSYNCCommand"
    }
    else {
        # Assume running on macOS
        $RSYNCCommand = "rsync -avz --delete ${DistFolder}/ ${remoteUsername}@${remoteHost}:${remotePath}"
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
}
else {
    Write-Host "Build failed. Exiting script."
}