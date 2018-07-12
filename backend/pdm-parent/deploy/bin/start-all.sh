#!/usr/bin/env bash

#set -x

echo "starting all services..."

# start services
cd ./serving
./serving-rest.sh start
sleep 10s
cd ..

cd ./datastore
./datastore.sh start
sleep 15s
cd ..

cd ./batch
./trace-batch-stream.sh start
./wave-batch-stream.sh start
sleep 15s
cd ..

cd ./speed
./speed-stream.sh start
sleep 15s
cd ..

cd ./collector
./collector start
sleep 5s
cd ..

cd ./simulator
./simulator.sh start
sleep 5s
cd ..

echo "All the services are up and running."