#!/usr/bin/env bash

echo "prepare kafka+zookeeper..."


docker stop $(docker ps -a -q)

docker rm $(docker ps -a -q)

cd /data

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
   -e ZOOKEEPER_SERVERS="10.50.20.246:22888:23888;10.50.20.246:32888:33888;10.50.20.246:42888:43888" \
   -v /data/zk1-data:/var/lib/zookeeper/data \
   -v /data/zk1-txn-logs:/var/lib/zookeeper/log \
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
   -e ZOOKEEPER_SERVERS="10.50.20.246:22888:23888;10.50.20.246:32888:33888;10.50.20.246:42888:43888" \
   -v /data/zk2-data:/var/lib/zookeeper/data \
   -v /data/zk2-txn-logs:/var/lib/zookeeper/log \
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
   -e ZOOKEEPER_SERVERS="10.50.20.246:22888:23888;10.50.20.246:32888:33888;10.50.20.246:42888:43888" \
   -v /data/zk3-data:/var/lib/zookeeper/data \
   -v /data/zk3-txn-logs:/var/lib/zookeeper/log \
   confluentinc/cp-zookeeper:4.1.0


echo "zk created."

sleep 5s

for i in 22181 32181 42181; do
  docker run --net=host --rm confluentinc/cp-zookeeper:4.1.0 bash -c "echo stat | nc 10.50.20.246 $i | grep Mode"
done


docker run -d \
    --net=host \
    --name=kafka-1 \
    -e KAFKA_JMX_PORT=9991 \
    -e KAFKA_ZOOKEEPER_CONNECT=10.50.20.246:22181,10.50.20.246:32181,10.50.20.246:42181 \
    -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://10.50.20.246:29092 \
    -v /data/kafka1-data:/var/lib/kafka/data \
    confluentinc/cp-kafka:4.1.0

sleep 1s

docker run -d \
    --net=host \
    --name=kafka-2 \
    -e KAFKA_JMX_PORT=9992 \
    -e KAFKA_ZOOKEEPER_CONNECT=10.50.20.246:22181,10.50.20.246:32181,10.50.20.246:42181 \
    -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://10.50.20.246:39092 \
    -v /data/kafka2-data:/var/lib/kafka/data \
    confluentinc/cp-kafka:4.1.0

sleep 1s

docker run -d \
     --net=host \
     --name=kafka-3 \
     -e KAFKA_JMX_PORT=9993 \
     -e KAFKA_ZOOKEEPER_CONNECT=10.50.20.246:22181,10.50.20.246:32181,10.50.20.246:42181 \
     -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://10.50.20.246:49092 \
     -v /data/kafka3-data:/var/lib/kafka/data \
     confluentinc/cp-kafka:4.1.0

sleep 9s


echo "kafka created."

docker run \
    --net=host \
    --rm \
    confluentinc/cp-kafka:4.1.0 \
    kafka-topics --create \
    --topic pdm-input-trace \
    --partitions 9 \
    --replication-factor 1 \
    --if-not-exists \
    --zookeeper 10.50.20.246:32181

sleep 5s

docker run \
    --net=host \
    --rm \
    confluentinc/cp-kafka:4.1.0 \
    kafka-topics --create \
    --topic pdm-input-raw \
    --partitions 9 \
    --replication-factor 1 \
    --if-not-exists \
    --zookeeper 10.50.20.246:32181

sleep 5s

docker run \
    --net=host \
    --rm \
    confluentinc/cp-kafka:4.1.0 \
    kafka-topics --create \
    --topic pdm-output-trace \
    --partitions 9 \
    --replication-factor 1 \
    --if-not-exists \
    --zookeeper 10.50.20.246:32181

sleep 5s

docker run \
    --net=host \
    --rm \
    confluentinc/cp-kafka:4.1.0 \
    kafka-topics --create \
    --topic pdm-output-raw \
    --partitions 9 \
    --replication-factor 1 \
    --if-not-exists \
    --zookeeper 10.50.20.246:32181

sleep 5s

docker run \
    --net=host \
    --rm \
    confluentinc/cp-kafka:4.1.0 \
    kafka-topics --create \
    --topic pdm-output-feature \
    --partitions 9 \
    --replication-factor 1 \
    --if-not-exists \
    --zookeeper 10.50.20.246:32181

sleep 5s

docker run \
    --net=host \
    --rm \
    confluentinc/cp-kafka:4.1.0 \
    kafka-topics --create \
    --topic pdm-output-fault \
    --partitions 9 \
    --replication-factor 1 \
    --if-not-exists \
    --zookeeper 10.50.20.246:32181

sleep 5s

docker run \
    --net=host \
    --rm \
    confluentinc/cp-kafka:4.1.0 \
    kafka-topics --create \
    --topic pdm-output-event \
    --partitions 9 \
    --replication-factor 1 \
    --if-not-exists \
    --zookeeper 10.50.20.246:32181 \
    --config retention.ms=3600000

sleep 5s

docker run \
    --net=host \
    --rm \
    confluentinc/cp-kafka:4.1.0 \
    kafka-topics --create \
    --topic pdm-route-feature \
    --partitions 9 \
    --replication-factor 1 \
    --if-not-exists \
    --zookeeper 10.50.20.246:32181

sleep 5s

docker run \
    --net=host \
    --rm \
    confluentinc/cp-kafka:4.1.0 \
    kafka-topics --create \
    --topic pdm-input-reload \
    --partitions 9 \
    --replication-factor 1 \
    --if-not-exists \
    --zookeeper 10.50.20.246:32181 

sleep 5s

docker run \
    --net=host \
    --rm \
    confluentinc/cp-kafka:4.1.0 \
    kafka-topics --create \
    --topic pdm-output-health \
    --partitions 9 \
    --replication-factor 1 \
    --if-not-exists \
    --zookeeper 10.50.20.246:32181 

sleep 5s

docker run \
    --net=host \
    --rm \
    confluentinc/cp-kafka:4.1.0 \
    kafka-topics --create \
    --topic pdm-route-health \
    --partitions 9 \
    --replication-factor 1 \
    --if-not-exists \
    --zookeeper 10.50.20.246:32181

sleep 5s

docker run \
    --net=host \
    --rm \
    confluentinc/cp-kafka:4.1.0 \
    kafka-topics --create \
    --topic pdm-output-reload \
    --partitions 9 \
    --replication-factor 1 \
    --if-not-exists \
    --zookeeper 10.50.20.246:32181 

sleep 5s

docker run \
    --net=host \
    --rm \
    confluentinc/cp-kafka:4.1.0 \
    kafka-topics \
    --list \
    --zookeeper 10.50.20.246:32181


echo "finished."

