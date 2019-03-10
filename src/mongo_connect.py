import pymongo 
import logging
from configs import *

DB_NAME = commons_config['DEFAULT']['DB_NAME']
MONGO_URL = commons_config['DEFAULT']['MONGO_URL']
PHOTOS_COLLECTION = commons_config['DEFAULT']['PHOTOS_COLLECTION']
logging.basicConfig(format=commons_config["DEFAULT"]["LOGGER_FORMAT"], level=logging.INFO)

def manage_mongo():
    logging.info(f"Connecting to the mongodb under: {MONGO_URL}, database: {DB_NAME}, collection: {PHOTOS_COLLECTION}")
    mongo_client = pymongo.MongoClient(MONGO_URL)
    db = mongo_client[DB_NAME]
    mongo_photos = db[PHOTOS_COLLECTION]
    return mongo_photos 