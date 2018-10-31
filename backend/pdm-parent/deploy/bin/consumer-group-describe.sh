#!/usr/bin/env bash

./bin/kafka-consumer-groups \
	--bootstrap-server localhost:9092 \
	--group pdm-store-trace \
	--describe

