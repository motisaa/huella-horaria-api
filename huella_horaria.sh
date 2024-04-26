docker rm -f huellahoraria
docker pull motisa/huellahoraria:latest 
docker run -d --name huellahoraria -p10088:8080 \
-e PORT=8080 \
-e MYSQL_HOST=mysql01.ariadnasw.com \
-e MYSQL_PORT=3306 \
-e MYSQL_USER=moti \
-e MYSQL_PASSWORD=holaSoyMoti123 \
-e MYSQL_DATABASE=huella_horaria \
-e WINSTON_FILELEVEL=info \
-e WINSTON_CONSOLELEVEL=debug \
--restart unless-stopped motisa/huellahoraria
