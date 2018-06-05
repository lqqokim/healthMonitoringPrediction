#!/usr/bin/env bash
# adjust this to reflect serving home on your computer
SERVING_HOME=/usr/local/serving

if [ -f SERVING_HOME/application.pid ]
then
  echo "PID file exists"
  pid="`cat SERVING_HOME/application.pid`"
  if [ "X`ps -p $pid | awk '{print $1}' | tail -1`" = "X"]
  then
    echo "Serving is running"
  else
    echo "Serving had crashed"
    $SERVING_HOME/serving-start.sh
  fi
else
  echo "PID file does not exist. Restarting..."
  $SERVING_HOME/serving-start.sh
fi
