#!/usr/bin/env bash

set -x

# start services
./serving-rest-start.sh start
./batch-stream-raw.sh start
./batch-stream-trace.sh start
./datastore-start.sh start
#./connector-log-start.sh start
