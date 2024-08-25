@echo off

if "%1" == "iniciar-npm" (
    echo Iniciando docker compose com endpoints NestJS
    set NESTJS_REPLICAS=1
) else (
    echo Iniciando docker compose sem endpoints NestJS
    set NESTJS_REPLICAS=0
    npm install && npm start
)

docker compose up -d