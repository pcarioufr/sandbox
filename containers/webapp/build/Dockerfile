FROM python:3.9.12-alpine3.15
WORKDIR /webapp

COPY requirements.txt /webapp/build/requirements.txt 
RUN pip3 install --upgrade pip
RUN pip3 install -r build/requirements.txt
