@echo off

echo [starting push db to dockerhub ...]

docker rm listene_db:1.0
docker build -t listene_db:1.0 -f Dockerfile.mysql
docker tag listene_db:1.0 zg04ckpt/listen-e:listene_db-1.0
docker push zg04ckpt/listen-e:listene_db-1.0

IF %ERRORLEVEL% NEQ 0 (
    ECHO [Error: Failed to push image!]
    exit /b %ERRORLEVEL%
)
echo [push db to dockerhub successfully!]