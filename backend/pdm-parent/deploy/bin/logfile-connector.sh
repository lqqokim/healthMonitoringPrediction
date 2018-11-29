#!/usr/bin/env bash
APPNAME="LogFile Connector Layer"
APPPID=connector.pid
APPJAR=pdm-file-connector-1.2-SNAPSHOT.jar
APPOPTS="-servingAddr http://localhost:8089
-brokers localhost:9092
-keylist EQP01,EQP02
-watchDir /data/fab1/area/eqp01
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
