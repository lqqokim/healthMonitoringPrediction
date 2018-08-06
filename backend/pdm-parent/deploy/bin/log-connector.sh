#!/usr/bin/env bash
APPNAME="Log Connector Layer"
APPPID=connector.pid
APPJAR=pdm-log-connector-1.0-SNAPSHOT.jar
APPOPTS=" -brokers 192.168.7.228:29092,192.168.7.228:39092,192.168.7.228:49092
-watchDir /home/bistel/fab1/Demo_Area/
-clientId log-connector-1
-topicPrefix pdm-input
-kafkaConf ./config/producer.properties
-log4jConf ./config/log4j.properties"

case $1 in
    start)
        echo "Starting $APPNAME server ..."
        if [ ! -f $APPPID ]; then
                nohup java -jar $APPJAR $APPOPTS 1>/dev/null 2>&1 &
                echo $! > $APPPID
            echo "$APPNAME started!"
        else
            echo "$APPNAME is already running ..."
        fi
    ;;

    stop)
        if [ -f $APPPID ]; then
            PID=$(cat $APPPID);
            echo "Stopping $APPNAME..."
            kill $PID;
            echo "$APPNAME stopped!"
            rm $APPPID
        else
            echo "$APPNAME is not running ..."
        fi
    ;;

    *)
        echo "Choose an option start/stop for the service"
    ;;
esac
