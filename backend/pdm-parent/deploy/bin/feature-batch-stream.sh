#!/usr/bin/env bash
APPNAME="Feature Layer - HEALTH"
APPPID=batch-feature.pid
APPJAR=pdm-batch-bundle-1.0-SNAPSHOT.jar
APPOPTS="-appId feature_01
-brokers 192.168.7.229:29092,192.168.7.229:39092,192.168.7.229:49092
-registryUrl http://192.168.7.229:8081
-servingAddr http://192.168.7.230:28000
-pipeline FEATURE
-log4jConf ./config/log4j-feature.properties"

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
