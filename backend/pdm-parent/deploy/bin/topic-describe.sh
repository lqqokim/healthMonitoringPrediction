#!/usr/bin/env bash

./bin/kafka-topics \
	--zookeeper localhost:2181 \
	--topic pdm-input-trace \
	--describe

