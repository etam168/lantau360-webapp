#!/bin/zsh
echo "Start ...."

# Variables
current_path=$PWD
docker_lantau360_dev=/Volumes/Projects/docker/lantau360-docker/lantau360-admin-dev/src/dist

 # Build staging enviroment
 yarn build --mode staging

 # copy build files to docker application
  cp -r dist/* $docker_lantau360_dev

# Github
# Add command
git -C $docker_lantau360_dev add .

#commit command
git -C $docker_lantau360_dev commit -m "Publish update vue dev"

#pull code first
git pull

#Push code to repo
 git -C $docker_lantau360_dev push

echo "Done"