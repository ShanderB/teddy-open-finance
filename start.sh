#!/bin/bash

if [ "$1" == "iniciar-npm" ]; then
echo "Iniciando docker compose com endpoints NestJS"
  export NESTJS_REPLICAS=1
else
echo "Iniciando docker compose sem endpoints NestJS"
  export NESTJS_REPLICAS=0
  npm start
fi

docker compose up -d