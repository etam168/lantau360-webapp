#!/bin/zsh
echo "Start ...."

# Variables
current_path=$PWD
docker_lantau360_admin=/Volumes/Projects/docker/lantau360-docker/lantau360-admin/src

 # Build production enviroment
 yarn build

 # copy build files to docker application
  cp -r dist/* $docker_lantau360_admin

# Github
# Add command
git -C $docker_lantau360_admin add .

#commit command
git -C $docker_lantau360_admin commit -m "Publish update vue prod"

#Push code to repo
 git -C $docker_lantau360_admin push

echo "Done"