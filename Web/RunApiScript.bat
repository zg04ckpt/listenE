docker stop api
docker rm api
docker rmi zg04ckpt/listen-e:listen_e_api-1.0
docker pull zg04ckpt/listen-e:listen_e_api-1.0
docker run -d -p 5001:80 --name api zg04ckpt/listen-e:listen_e_api-1.0