import pymongo 
import logging
from mongo_connect import manage_mongo
from bson.json_util import dumps
from configs import *

DATE = commons_config['JSON_FORMAT']['DATE']
ID = commons_config['JSON_FORMAT']['ID']
LONGITUDE = commons_config['JSON_FORMAT']['LONGITUDE']
LATITUDE = commons_config['JSON_FORMAT']['LATITUDE']
VIEWS = commons_config['JSON_FORMAT']['VIEWS']

mongo_photos = manage_mongo()

def find_by_dates(start, end):
    records = mongo_photos.find({DATE: {'$gte': start, '$lt': end}})
    return dumps(records)

def find_by_location(long_start, long_end, lat_start, lat_end, top_by_views=0):

    records = mongo_photos.find({LONGITUDE: {'$gte': long_start, '$lt': long_end}, 
                                LATITUDE: {'$gte': lat_start, '$lt': lat_end}}) \
                                .sort([(VIEWS, -1)]) \
                                .limit(top_by_views);
    return dumps(records)

def find_by_id(photo_id):
    record = mongo_photos.find_one({ID: photo_id})
    return record

# example
dates=find_by_dates("2007-10-10T00:00:00", "2007-11-10T00:00:00")
locations=find_by_location(-123.00, -122.00, 38.00, 39.00, top_by_views=5)
photo=find_by_id(1595340828)

print(f"Dates:\n{dates} \n")
print(f"Locations:\n{locations} \n")
print(f"Photo:\n{photo} \n")