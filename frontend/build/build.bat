call edr_build.bat %*
call edr_build_BD.bat %*
call edm_build.bat %*
call edl_build_setupkit.bat %*

IF NOT EXIST release mkdir release
copy ..\eDataLyzer\BISTel.eDataLyzer.Setup\Release\*.* .\release /y
copy ..\eDataLyzer\packages\Install_eDataLyzer.bat .\release /y
copy ..\eDataLyzer\packages\eDataRealm\eDataRealm.tar.gz .\release /y
copy ..\eDataLyzer\packages\eDataRealmBD\eDataRealmBD.tar.gz .\release /y
copy ..\eDataLyzer\packages\eDataManager\eDataManager.tar.gz .\release /y
copy ..\buildinfo.txt .\release /y

REM pause
