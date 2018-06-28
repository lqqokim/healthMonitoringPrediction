#!/usr/bin/env bash

set -x

# start services
cd ./serving-rest
./serving-rest.sh start
cd ..

cd ./batch
./trace-batch-stream.sh start
./wave-batch-stream.sh start
cd ..

cd ./speed
./speed-stream.sh start
cd ..

cd ./datastore
./datastore.sh start
cd ..

#./log-connector.sh start
