#!/bin/sh

docker compose \
    -f ./containers/compose.yml \
    -f ./containers/datadog/compose.yml \
    -f ./containers/nginx/compose.yml \
    -f ./containers/redis/compose.yml \
    -f ./containers/terraform/compose.yml \
    -f ./containers/webapp/compose.yml \
    up 