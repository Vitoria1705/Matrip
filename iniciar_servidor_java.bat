@echo off
echo Iniciando servidor backend em Java Spring Boot...
set "JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.10.7-hotspot"
set "PATH=%JAVA_HOME%\bin;%PATH%"
cd /d "%~dp0backend-java"
"..\apache-maven-3.9.6\bin\mvn.cmd" spring-boot:run
pause
