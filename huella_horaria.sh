docker rm -f huellahoraria
docker pull motisa/huellahoraria:latest 
docker run -d --name huellahoraria -p10088:8080 \
-e PORT= \
-e MYSQL_HOST=mysql01.ariadnasw.com \
-e MYSQL_PORT=3306 \
-e MYSQL_USER= \
-e MYSQL_PASSWORD= \
-e MYSQL_DATABASE=huella_horaria \
-e WINSTON_FILELEVEL=info \
-e WINSTON_CONSOLELEVEL=debug \
--restart unless-stopped motisa/huellahoraria
