#!/usr/bin/env bash

set -x

# serving layer app
cp -R /Users/hansonjang/Documents/opensource/pdm-parent/deploy/pdm-serving-bundle/target/serving-rest/* \
/Users/hansonjang/pdm/serving/

cp -R /Users/hansonjang/Documents/opensource/pdm-parent/deploy/pdm-serving-bundle/target/serving-rest/lib/* \
/Users/hansonjang/pdm/serving/lib/

# stream processing app
cp /Users/hansonjang/Documents/opensource/pdm-parent/deploy/pdm-batch-pipeline-bundle/target/uber-pdm-batch-pipeline-bundle-1.0-SNAPSHOT.jar \
/Users/hansonjang/pdm/batch/

# data store app
cp -R /Users/hansonjang/Documents/opensource/pdm-parent/deploy/pdm-datastore-sink-bundle/target/datastore/* \
/Users/hansonjang/pdm/datastore/

cp -R /Users/hansonjang/Documents/opensource/pdm-parent/deploy/pdm-datastore-sink-bundle/target/datastore/lib/* \
/Users/hansonjang/pdm/datastore/lib/

# connector
cp -R /Users/hansonjang/Documents/opensource/pdm-parent/support/pdm-log-connector/target/uber-pdm-log-connector-1.0-SNAPSHOT.jar \
/Users/hansonjang/pdm/connector/

# data generator
cp /Users/hansonjang/Documents/opensource/pdm-parent/support/pdm-datagen/target/uber-pdm-datagen-1.0-SNAPSHOT.jar \
/Users/hansonjang/pdm/datagen/

# scripts
cp /Users/hansonjang/Documents/opensource/pdm-parent/deploy/bin/* /Users/hansonjang/pdm/scripts

# properties
cp /Users/hansonjang/Documents/opensource/pdm-parent/support/pdm-log-connector/src/main/resources/*.properties \
/Users/hansonjang/pdm/config

cp /Users/hansonjang/Documents/opensource/pdm-parent/serving-layer/pdm-serving/src/main/resources/*.properties \
/Users/hansonjang/pdm/config

cp /Users/hansonjang/Documents/opensource/pdm-parent/common/pdm-datastore/src/main/resources/*.properties \
/Users/hansonjang/pdm/config