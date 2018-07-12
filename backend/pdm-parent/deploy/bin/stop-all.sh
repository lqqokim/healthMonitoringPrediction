#!/usr/bin/env bash

#set -x

echo "stopping all services..."

#stop services
cd ./collector
./collector stop
cd ..

cd ./simulator
./simulator.sh stop
cd ..

sleep 5s

cd ./speed
./speed-stream.sh stop
cd ..

cd ./batch
./trace-batch-stream.sh stop
./wave-batch-stream.sh stop
cd ..

cd ./datastore
./datastore.sh stop
cd ..

cd ./serving
./serving-rest.sh stop
cd ..

echo "All the services are down."