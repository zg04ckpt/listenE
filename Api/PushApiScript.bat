docker rmi listen_e_api:1.0
docker build -t listen_e_api:1.0 .
docker tag listen_e_api:1.0 zg04ckpt/listen-e:listen_e_api-1.0
docker push zg04ckpt/listen-e:listen_e_api-1.0