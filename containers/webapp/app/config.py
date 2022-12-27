import os

class Config:

    REDIS_HOST = os.environ.get("REDIS_HOST")
    REDIS_STORE_URL = "redis://:@{url}/1".format(url=REDIS_HOST)

    DD_CLIENT_TOKEN = os.environ.get("DD_CLIENT_TOKEN")
    DD_APPLICATION_ID = os.environ.get("DD_APPLICATION_ID")
    DD_VERSION = os.environ.get("DD_VERSION")
    DD_ENV = os.environ.get("DD_ENV")
