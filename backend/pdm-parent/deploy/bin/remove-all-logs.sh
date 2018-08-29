#!/usr/bin/env bash

for ((i=1;i<=9;i++));
do
   # your-unix-command-here
   echo $i
   rm -rf ./speed_$i/logs/*
   #rm -rf ./batch_$i/logs/*
   #rm -rf ./datastore_$i/logs/*
done

#rm -rf ./serving/logs/*

echo "remove all log files..."

