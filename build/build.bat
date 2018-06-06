@echo off
cls
ECHO "eHMP Build Starting...."

cd ..\frontend\build
call build.bat
cd ..\..\

cd .\backend\build
call build.bat
cd ..\..\build

IF EXIST release goto cleanpackage else packaging

:cleanpackage
echo release folder exists
for /R %%x in (release) do if exist "%%x" del /q "%%x\*.*"
rd /s /q release
goto packaging

:packaging
mkdir release
xcopy ..\backend\build\package\* .\release /y

:end

echo "eHMP Build finished."