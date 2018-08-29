#!/usr/bin/env bash

#set -x

echo "starting all services..."

# start services
cd ./serving
./serving-rest.sh stop
cd ..

./datastore-all-stop.sh
./speed-all-stop.sh
./trace-all-stop.sh
#./health-all-stop.sh

echo "All the services are up and running."
