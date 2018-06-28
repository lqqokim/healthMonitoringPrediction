#!/usr/bin/env bash

set -x

# deploy jar
cp -R ../pdm-serving-bundle/target/*.tar.gz ../../../build/
cp -R ../pdm-batch-bundle/target/*.tar.gz ../../../build/
cp -R ../pdm-speed-bundle/target/*.tar.gz ../../../build/
cp -R ../pdm-datastore-bundle/target/*.tar.gz ../../../build/
cp -R ../pdm-datastore-bundle/target/*.tar.gz ../../../build/

# connector
cp -R ../../support/pdm-log-connector/target/*.tar.gz ../../../build/

# scripts
rm -rf ../../../build/scripts
mkdir ../../../build/scripts
cp -R ../scripts/* ../../../build/scripts

