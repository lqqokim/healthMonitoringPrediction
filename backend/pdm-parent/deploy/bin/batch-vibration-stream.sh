#!/usr/bin/env bash
APPNAME="Batch Stream for Vibration"
APPPID=batch-vibration.pid
APPJAR=pdm-batch-bundle-1.2-SNAPSHOT.jar
APPOPTS="-appId pdm-batch-vibration-v1.2.0
-brokers 192.168.7.228:29092,192.168.7.228:39092,192.168.7.228:49092
-servingAddr http://localhost:8089
-pipeline VIBRATION
-streamThreads 2
-stateDir /tmp/kafka-streams
-log4jConf ./config/log4j-vibration.properties"

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