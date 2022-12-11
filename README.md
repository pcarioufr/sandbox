
# what this sandbox

The full-stact app consists of 4 containers:
* a nginx web-server
* a python/flask web application
* a redis datastore
* a datadog agent running as a side car

The sandbox also uses a ubuntu 20.4 image to run terraform.

# setup

Install [docker desktop](https://www.docker.com/products/docker-desktop/) (comes with docker compose)

# run 

from your terminal 
* `cd /path/to/sandbox`
* `docker compose up`

from your web browser
* http://localhost:80

