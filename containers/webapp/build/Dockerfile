FROM python:3.9.12-alpine3.15
WORKDIR /webapp

# Installing zlib, dependency for qrcode
RUN apk add --no-cache jpeg-dev zlib-dev

COPY requirements.txt /webapp/build/requirements.txt 
RUN pip3 install --upgrade pip
RUN pip3 install -r build/requirements.txt
