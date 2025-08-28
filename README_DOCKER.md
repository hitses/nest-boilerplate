# Console commands for Docker

This file contains the commands to run the Docker containers for this project.

#### Descargar la imagen de MongoDB (si no está en local)

`docker-compose pull`

#### Crear y levantar el contenedor en segundo plano

`docker-compose up -d`

#### Ver los contenedores corriendo y sus puertos

`docker ps`

#### Entrar en la shell de MongoDB dentro del contenedor

`docker exec -it mongodb mongosh -u root -p root`

#### Detener el contenedor sin eliminarlo

`docker-compose stop`

#### Detener y eliminar el contenedor y la red creada, pero mantener volúmenes

`docker-compose down`

#### Detener y eliminar contenedor, red y volúmenes (borrar datos)

`docker-compose down -v`

#### Reiniciar el contenedor sin destruirlo

`docker-compose restart`
