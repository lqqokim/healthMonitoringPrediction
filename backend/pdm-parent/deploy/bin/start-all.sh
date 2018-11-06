#!/usr/bin/env bash

#set -x

echo "starting all services..."

# start services
cd ./serving
./serving-rest.sh start
sleep 3s
cd ..
echo "rest service started."

cd ./datastore
./datastore.sh start
sleep 5s
cd ..
echo "data-store started."

cd ./speed
./speed-realtime-stream.sh start
sleep 5s
cd ..
echo "speed-realtime started."

cd ./batch
./batch-summary-stream.sh start
sleep 5s
cd ..
echo "batch-summary started."

cd ./batch
./batch-vibration-stream.sh start
sleep 5s
cd ..
echo "batch-vibration started."

cd ./timeout
./speed-timeout-stream.sh start
sleep 5s
cd ..
echo "time checker started."

echo "All the services are up and running."