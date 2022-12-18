#!/bin/sh

docker compose \
    --env-file sandbox.env \
    -f ./containers/compose.yml \
    -f ./containers/terraform/compose.yml \
    run --rm terraform -chdir=/config $@ 