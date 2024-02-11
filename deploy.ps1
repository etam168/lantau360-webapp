# Navigate to the dist folder
cd .\dist

# Compress the contents inside the dist folder into a zip file
Compress-Archive -Path .\* -DestinationPath "..\dist.zip"

# Navigate back to the parent directory
cd ..

# Copy the zip file to the server using SCP
scp .\dist.zip root@97.74.95.249:/home/host1/domains/app.lantau360.com/public_html/

# Remove the local zip file
Remove-Item .\dist.zip
