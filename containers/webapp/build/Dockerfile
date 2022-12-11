FROM python:3.9.12-alpine3.15
WORKDIR /webapp

COPY requirements.txt /webapp/build/requirements.txt 
RUN pip3 install --upgrade pip
RUN pip3 install -r build/requirements.txt


# install PGSQL
RUN apk update && apk add libpq
RUN apk add --no-cache g++ postgresql-dev libffi-dev cargo