#!/usr/bin/env bash

#set -x

echo "kafka starting..."

./confluent-4.1.0/bin/kafka-topics --create \
	--zookeeper localhost:2181 \
	--replication-factor 1 \
	--partitions 10 \
	--topic pdm-input-trace

./confluent-4.1.0/bin/kafka-topics --create \
        --zookeeper localhost:2181 \
        --replication-factor 1 \
        --partitions 10 \
        --topic pdm-input-raw

./confluent-4.1.0/bin/kafka-topics --create \
        --zookeeper localhost:2181 \
        --replication-factor 1 \
        --partitions 10 \
        --topic pdm-output-trace

./confluent-4.1.0/bin/kafka-topics --create \
        --zookeeper localhost:2181 \
        --replication-factor 1 \
        --partitions 10 \
        --topic pdm-output-raw

./confluent-4.1.0/bin/kafka-topics --create \
        --zookeeper localhost:2181 \
        --replication-factor 1 \
        --partitions 10 \
        --topic pdm-output-event

./confluent-4.1.0/bin/kafka-topics --create \
        --zookeeper localhost:2181 \
        --replication-factor 1 \
        --partitions 10 \
        --topic pdm-output-feature

./confluent-4.1.0/bin/kafka-topics --create \
        --zookeeper localhost:2181 \
        --replication-factor 1 \
        --partitions 10 \
        --topic pdm-output-fault

./confluent-4.1.0/bin/kafka-topics --create \
        --zookeeper localhost:2181 \
        --replication-factor 1 \
        --partitions 10 \
        --topic pdm-output-health

./confluent-4.1.0/bin/kafka-topics --create \
        --zookeeper localhost:2181 \
        --replication-factor 1 \
        --partitions 10 \
        --topic pdm-output-reload

./confluent-4.1.0/bin/kafka-topics --list \
        --zookeeper localhost:2181


echo "all topics are created."
