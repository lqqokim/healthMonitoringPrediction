#!/usr/bin/env bash

#set -x

echo "starting all services..."

# start services
cd ./serving
./serving-rest.sh start
sleep 3s
cd ..

./datastore-all-start.sh
./speed-all-start.sh
./trace-all-start.sh
#./health-all-start.sh

echo "All the services are up and running."
