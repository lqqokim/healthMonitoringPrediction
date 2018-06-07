#!/usr/bin/env bash

set -x

# start services
./serving-rest.sh start
./batch-stream-raw.sh start
./batch-stream-trace.sh start
./datastore.sh start
#./log-connector.sh start
