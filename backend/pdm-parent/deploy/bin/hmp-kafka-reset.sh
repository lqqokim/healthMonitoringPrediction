#!/usr/bin/env bash

echo "prepare kafka+zookeeper..."


docker stop $(docker ps -a -q)

docker rm $(docker ps -a -q)

cd /data/bistel

rm -rf kafka*

rm -rf zk*

echo "cache folder removed."

sleep 1s


docker run -d \
   --net=host \
   --name=zk-1 \
   -e ZOOKEEPER_SERVER_ID=1 \
   -e ZOOKEEPER_CLIENT_PORT=22181 \
   -e ZOOKEEPER_TICK_TIME=2000 \
   -e ZOOKEEPER_INIT_LIMIT=5 \
   -e ZOOKEEPER_SYNC_LIMIT=2 \
   -e ZOOKEEPER_SERVERS="localhost:22888:23888;localhost:32888:33888;localhost:42888:43888" \
   -v /data/bistel/zk1-data:/var/lib/zookeeper/data \
   -v /data/bistel/zk1-txn-logs:/var/lib/zookeeper/log \
   confluentinc/cp-zookeeper:4.1.0

sleep 1s

docker run -d \
   --net=host \
   --name=zk-2 \
   -e ZOOKEEPER_SERVER_ID=2 \
   -e ZOOKEEPER_CLIENT_PORT=32181 \
   -e ZOOKEEPER_TICK_TIME=2000 \
   -e ZOOKEEPER_INIT_LIMIT=5 \
   -e ZOOKEEPER_SYNC_LIMIT=2 \
   -e ZOOKEEPER_SERVERS="localhost:22888:23888;localhost:32888:33888;localhost:42888:43888" \
   -v /data/bistel/zk2-data:/var/lib/zookeeper/data \
   -v /data/bistel/zk2-txn-logs:/var/lib/zookeeper/log \
   confluentinc/cp-zookeeper:4.1.0

sleep 1s

docker run -d \
   --net=host \
   --name=zk-3 \
   -e ZOOKEEPER_SERVER_ID=3 \
   -e ZOOKEEPER_CLIENT_PORT=42181 \
   -e ZOOKEEPER_TICK_TIME=2000 \
   -e ZOOKEEPER_INIT_LIMIT=5 \
   -e ZOOKEEPER_SYNC_LIMIT=2 \
   -e ZOOKEEPER_SERVERS="localhost:22888:23888;localhost:32888:33888;localhost:42888:43888" \
   -v /data/bistel/zk3-data:/var/lib/zookeeper/data \
   -v /data/bistel/zk3-txn-logs:/var/lib/zookeeper/log \
   confluentinc/cp-zookeeper:4.1.0


echo "zk created."

sleep 5s

for i in 22181 32181 42181; do
  docker run --net=host --rm confluentinc/cp-zookeeper:4.1.0 bash -c "echo stat | nc localhost $i | grep Mode"
done


docker run -d \
    --net=host \
    --name=kafka-1 \
    -e KAFKA_JMX_PORT=9991 \
    -e KAFKA_ZOOKEEPER_CONNECT=localhost:22181,localhost:32181,localhost:42181 \
    -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://localhost:29092 \
    -v /data/bistel/kafka1-data:/var/lib/kafka/data \
    confluentinc/cp-kafka:4.1.0

sleep 1s

docker run -d \
    --net=host \
    --name=kafka-2 \
    -e KAFKA_JMX_PORT=9992 \
    -e KAFKA_ZOOKEEPER_CONNECT=localhost:22181,localhost:32181,localhost:42181 \
    -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://localhost:39092 \
    -v /data/bistel/kafka2-data:/var/lib/kafka/data \
    confluentinc/cp-kafka:4.1.0

sleep 1s

docker run -d \
     --net=host \
     --name=kafka-3 \
     -e KAFKA_JMX_PORT=9993 \
     -e KAFKA_ZOOKEEPER_CONNECT=localhost:22181,localhost:32181,localhost:42181 \
     -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://localhost:49092 \
     -v /data/bistel/kafka3-data:/var/lib/kafka/data \
     confluentinc/cp-kafka:4.1.0

sleep 10s


echo "kafka created."

docker run \
    --net=host \
    --rm \
    confluentinc/cp-kafka:4.1.0 \
    kafka-topics --create \
    --topic pdm-input-trace \
    --partitions 10 \
    --replication-factor 1 \
    --if-not-exists \
    --zookeeper localhost:32181

sleep 5s

docker run \
    --net=host \
    --rm \
    confluentinc/cp-kafka:4.1.0 \
    kafka-topics --create \
    --topic pdm-input-raw \
    --partitions 10 \
    --replication-factor 1 \
    --if-not-exists \
    --zookeeper localhost:32181

sleep 5s

docker run \
    --net=host \
    --rm \
    confluentinc/cp-kafka:4.1.0 \
    kafka-topics --create \
    --topic pdm-output-trace \
    --partitions 10 \
    --replication-factor 1 \
    --if-not-exists \
    --zookeeper localhost:32181

sleep 5s

docker run \
    --net=host \
    --rm \
    confluentinc/cp-kafka:4.1.0 \
    kafka-topics --create \
    --topic pdm-output-raw \
    --partitions 10 \
    --replication-factor 1 \
    --if-not-exists \
    --zookeeper localhost:32181

sleep 5s

docker run \
    --net=host \
    --rm \
    confluentinc/cp-kafka:4.1.0 \
    kafka-topics --create \
    --topic pdm-output-feature \
    --partitions 10 \
    --replication-factor 1 \
    --if-not-exists \
    --zookeeper localhost:32181

sleep 5s

docker run \
    --net=host \
    --rm \
    confluentinc/cp-kafka:4.1.0 \
    kafka-topics --create \
    --topic pdm-output-fault \
    --partitions 10 \
    --replication-factor 1 \
    --if-not-exists \
    --zookeeper localhost:32181

sleep 5s

docker run \
    --net=host \
    --rm \
    confluentinc/cp-kafka:4.1.0 \
    kafka-topics --create \
    --topic pdm-output-event \
    --partitions 10 \
    --replication-factor 1 \
    --if-not-exists \
    --zookeeper localhost:32181 \
    --config retention.ms=3600000

sleep 5s

docker run \
    --net=host \
    --rm \
    confluentinc/cp-kafka:4.1.0 \
    kafka-topics --create \
    --topic pdm-route-feature \
    --partitions 10 \
    --replication-factor 1 \
    --if-not-exists \
    --zookeeper localhost:32181

sleep 5s

docker run \
    --net=host \
    --rm \
    confluentinc/cp-kafka:4.1.0 \
    kafka-topics --create \
    --topic pdm-input-reload \
    --partitions 10 \
    --replication-factor 1 \
    --if-not-exists \
    --zookeeper localhost:32181 

sleep 5s

docker run \
    --net=host \
    --rm \
    confluentinc/cp-kafka:4.1.0 \
    kafka-topics --create \
    --topic pdm-output-param-health \
    --partitions 10 \
    --replication-factor 1 \
    --if-not-exists \
    --zookeeper localhost:32181 

sleep 5s

docker run \
    --net=host \
    --rm \
    confluentinc/cp-kafka:4.1.0 \
    kafka-topics --create \
    --topic pdm-output-eqp-health \
    --partitions 10 \
    --replication-factor 1 \
    --if-not-exists \
    --zookeeper localhost:32181 

sleep 5s

docker run \
    --net=host \
    --rm \
    confluentinc/cp-kafka:4.1.0 \
    kafka-topics --create \
    --topic pdm-route-health \
    --partitions 10 \
    --replication-factor 1 \
    --if-not-exists \
    --zookeeper localhost:32181

sleep 5s

docker run \
    --net=host \
    --rm \
    confluentinc/cp-kafka:4.1.0 \
    kafka-topics --create \
    --topic pdm-output-reload \
    --partitions 10 \
    --replication-factor 1 \
    --if-not-exists \
    --zookeeper localhost:32181 

sleep 5s


docker run \
    --net=host \
    --rm \
    confluentinc/cp-kafka:4.1.0 \
    kafka-topics \
    --list \
    --zookeeper localhost:32181


echo "finished."

