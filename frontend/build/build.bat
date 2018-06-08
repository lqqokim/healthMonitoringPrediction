@echo off
cls
ECHO "eHMP Frontend Build Starting...."

cd ..\pdm-web

call npm cache clean 
call npm install
call gulp build.prod --base=/portal/ --env=prod --config-env=prod
call xcopy .\dist\prod  ..\..\backend\pdm-portal\portal\src\main\webapp\resources\  /s /e /h /y

echo "eHMP Frontend Build finished."