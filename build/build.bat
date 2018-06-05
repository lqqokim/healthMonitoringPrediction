@echo off
cls
ECHO "eHMP Build Starting...."

cd ..\frontend\build
call build.bat
cd ..\..\

cd .\backend\build
call build.bat
cd ..\..\build

IF EXIST release goto clean else create

:clean
echo release folder exists
for /R %%x in (release) do if exist "%%x" del /q "%%x\*.*"
rd /s /q release
goto packaging

:create
mkdir release
goto packaging

:packaging

xcopy ..\backend\build\package\* .\release /y

:end


echo "eHMP Build finished."