# ****** Confluent 4.0.0 Ports *******
# ZooKeeper : 2181
# REST Proxy : 8082
# Apache Kafka brokers : 9092
# Confluent Control Center : 9021
# Kafka Connect REST API : 8083
# Schema Registry REST API :8081

# ****** PdM Ports *******
# serving layer : 82000

# start confluent 4.0 (with kafka 1.0.0)
> ./bin/confluent start or stop(destroy)

# Create topics
> bin/kafka-topics --create --zookeeper localhost:2181 --replication-factor 1 --partitions 4 --topic pdm-input-rms
> bin/kafka-topics --create --zookeeper localhost:2181 --replication-factor 1 --partitions 4 --topic pdm-input-raw
> bin/kafka-topics --create --zookeeper localhost:2181 --replication-factor 1 --partitions 4 --topic pdm-output-rms
> bin/kafka-topics --create --zookeeper localhost:2181 --replication-factor 1 --partitions 4 --topic pdm-output-raw
> bin/kafka-topics --create --zookeeper localhost:2181 --replication-factor 1 --partitions 4 --topic pdm-model

# List topics
> bin/kafka-topics --zookeeper localhost:2181 --list

# start serving layer
> serving-rest.sh

# start consumer service for Oracle
> repository-consumer.sh
# e.g. for testing
> bin/kafka-console-consumer --bootstrap-server localhost:9092 --topic pdm-output \
    --from-beginning \
    --formatter kafka.tools.DefaultMessageFormatter \
    --property print.key=true \
    --property print.value=true \
    --property key.deserializer=org.apache.kafka.common.serialization.StringDeserializer \
    --property value.deserializer=io.confluent.kafka.serializers.KafkaAvroDeserializer

# start batch layer
> batch-pipeline.sh

# start producer service
> log-producer.sh




######################################################################################################################


