docker stop listene_api listene_db
docker rm listene_api listene_db
docker rmi listene_api listene_db
docker-compose -f ../docker-compose.development.yaml pull