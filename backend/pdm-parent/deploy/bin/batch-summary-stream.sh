#!/usr/bin/env bash
APPNAME="Batch Layer - Feature Summary"
APPPID=batch-summary.pid
APPJAR=pdm-batch-bundle-1.0-SNAPSHOT.jar
APPOPTS="-appId pdm-batch-summary-v1.1.0
-brokers 192.168.7.228:29092,192.168.7.228:39092,192.168.7.228:49092
-servingAddr http://192.168.7.227:8089
-pipeline SUMMARY
-streamThreads 2
-log4jConf ./config/log4j-summary.properties"

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