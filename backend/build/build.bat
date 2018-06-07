@echo off
cls
ECHO "eHMP Backend Build Starting...."

IF EXIST package goto cleanpackage else packaging

:cleanpackage
echo package folder exists
for /R %%x in (package) do if exist "%%x" del /q "%%x\*.*"
rd /s /q package
goto packaging

:packaging
mkdir package
cd ..\pdm-parent

REM call mvn -s "%MAVEN_HOME%\conf\.settings.xml" clean package -DskipTests -DexcludeScope=provided
call mvn clean package -DskipTests -DexcludeScope=provided

xcopy .\support\pdm-log-connector\target\*.tar.gz ..\build\package /y
xcopy .\deploy\pdm-serving-bundle\target\*.tar.gz ..\build\package /y
xcopy .\deploy\pdm-datastore-sink-bundle\target\*.tar.gz ..\build\package /y
xcopy .\deploy\pdm-batch-pipeline-bundle\target\*.tar.gz ..\build\package /y

cd ..\pdm-portal

REM call mvn -s "%MAVEN_HOME%\conf\.settings.xml" clean package -DskipTests -DexcludeScope=provided
call mvn clean package -DskipTests -DexcludeScope=provided

xcopy .\portal\target\*.war ..\build\package /y

cd ..\build
:end

echo "eHMP Backend Build finished."
