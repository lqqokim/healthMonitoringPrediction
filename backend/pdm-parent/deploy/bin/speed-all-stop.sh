#!/usr/bin/env bash

#set -x

echo "starting all datastore services..."

# start services

for ((i=1;i<=9;i++));
do
   # your-unix-command-here
   echo $i
   cd ./speed_$i
   ./speed-stream.sh stop
   cd ..
done

echo "All the datastore services are up and running."
