@echo off
echo [starting push api to dockerhub...]

REM Bật chế độ kiểm tra lỗi
setlocal EnableDelayedExpansion

REM Xóa image cũ
docker rmi listene_api:1.0

REM Build image
docker build -t listene_api:1.0 . -f Dockerfile.api || (
    echo [Error: Failed to build image!]
    exit /b 1
)

REM Tag image
docker tag listene_api:1.0 zg04ckpt/listen-e:listene_api-1.0 || (
    echo [Error: Failed to tag image!]
    exit /b 1
)

REM Push image
docker push zg04ckpt/listen-e:listene_api-1.0 || (
    echo [Error: Failed to push image!]
    exit /b 1
)

echo [push api to dockerhub successfully!]
exit /b 0