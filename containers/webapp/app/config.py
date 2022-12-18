import os

class Config:

    REDIS_HOST = os.environ.get("REDIS_HOST")
    REDIS_STORE_URL = "redis://:@{url}/1".format(url=REDIS_HOST)
