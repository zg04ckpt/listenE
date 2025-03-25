@echo off
echo [starting push api to dockerhub...]

docker rmi listene_api:1.0
docker build -t listene_api:1.0 . -f Dockerfile.api
docker tag listene_api:1.0 zg04ckpt/listen-e:listene_api-1.0
docker push zg04ckpt/listen-e:listene_api-1.0

IF %ERRORLEVEL% NEQ 0 (
    ECHO [Error: Failed to push image!]
    exit /b %ERRORLEVEL%
)
echo [push api to dockerhub successfully!]