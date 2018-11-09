#!/usr/bin/env bash

#set -x

echo "starting all services..."

# start services

cd ./timeout
./speed-timeout-stream.sh stop
cd ..

cd ./vibration
./batch-vibration-stream.sh stop
cd ..

cd ./batch
./batch-summary-stream.sh stop
cd ..

cd ./speed
./speed-realtime-stream.sh stop
cd ..

cd ./datastore
./datastore.sh stop
cd ..

cd ./serving
./serving-rest.sh stop
cd ..

echo "All the services are up and running."
