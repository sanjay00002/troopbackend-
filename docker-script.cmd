@echo off

docker buildx build --platform=linux/amd64 -t backend -f Dockerfile-backend . 
docker tag backend shashankagarwaltroopapp/backend:1.0
docker push shashankagarwaltroopapp/backend:1.0
docker buildx build --platform=linux/amd64 -t websocket -f Dockerfile-websockets .
docker tag websocket shashankagarwaltroopapp/websocket:1.0
docker push shashankagarwaltroopapp/websocket:1.0