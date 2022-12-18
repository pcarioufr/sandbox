Tested on Macbook Pro M1 - Mac OS Ventura 
Should work on Unix Based OS

# what this sandbox

The full-stact app consists of 4 containers:
* a nginx web-server
* a python/flask web application
* a redis datastore
* a datadog agent running as a side car

The sandbox also has a terraform container, to do stuff.

# setup

Install [docker desktop](https://www.docker.com/products/docker-desktop/) (comes with docker compose)

# run 

from your terminal 
* `cd /path/to/sandbox`
* `docker compose up`

from your web browser
* http://localhost:80


# terraform

`./terraform.sh init -upgrade`
`./terraform.sh workspace new sandbox`
`./terraform.sh workspace select sandbox`
`./terraform.sh plan`
`./terraform.sh apply`