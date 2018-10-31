#!/usr/bin/env bash

#set -x

echo "kafka starting..."

./confluent-4.1.0/bin/zookeeper-server-start -daemon ./confluent-4.1.0/etc/kafka/zookeeper.properties

sleep 5s

export KAFKA_HEAP_OPTS="-Xmx1g -Xms1g"

./confluent-4.1.0/bin/kafka-server-start -daemon ./confluent-4.1.0/etc/kafka/server.properties

echo "kafka started."

