from datetime import datetime
import xml.etree.ElementTree as etree
from xml.etree.ElementTree import Element   
import lxml.etree as letree
import json
import pymongo 
import logging
from mongo_connect import manage_mongo
from configs import *

logging.basicConfig(format=commons_config["DEFAULT"]["LOGGER_FORMAT"], level=logging.INFO)

PATHS = [x.strip() for x in  xml_config["DEFAULT"]["INPUT_FILES"].split(',')]
URL_TEMPLATE = xml_config["DEFAULT"]["URL_TEMPLATE"]

DATEUPLOADED = 'dateuploaded'
DATE_MAP = commons_config['JSON_FORMAT']['DATE']
ID = "id"
ID_MAP = commons_config['JSON_FORMAT']['ID']

ATTRIBUTES = [ID, DATEUPLOADED , "views"]
URL_ATTRIBUTES = ['farm', ID, 'secret', 'server']
LATITUDE = "latitude"
LONGITUDE = "longitude"
LOCATION = "location"
PHOTO = "photo"
LABELS = "labels"
URL = "url"

def parse_file(file_path, mongo_collection=None):
    logging.info(f"Parsing file {file_path}")
    context = etree.iterparse(file_path, events=("start", "end"))
    for event, element in context:
        if event == 'start' and element.tag == PHOTO:
            location_element = element.find(LOCATION)
            labels_element = element.find(LABELS)
            if location_element != None and labels_element != None:
                photo = {}
                labels = []
                url = URL_TEMPLATE

                for attrib in ATTRIBUTES:
                    if attrib == DATEUPLOADED:
                        photo[DATE_MAP] = datetime.fromtimestamp(int(element.attrib[attrib])).isoformat()
                    elif attrib == ID:
                        photo[ID_MAP] = int(element.attrib[attrib])
                    elif attrib.isdigit():
                        photo[attrib] = int(element.attrib[attrib])
                    else:    
                        photo[attrib] = element.attrib[attrib]

                for attrib in URL_ATTRIBUTES:
                    url = url.replace(f"{{{attrib}}}", element.attrib[attrib])

                for label in labels_element:
                    labels.append(label.text)

                photo[URL] = url
                photo[LATITUDE] = float(location_element.attrib[LATITUDE])
                photo[LONGITUDE] = float(location_element.attrib[LONGITUDE])
                photo[LABELS] = labels

                if mongo_collection != None:
                    mongo_collection.replace_one({"_id": photo[ID_MAP]}, photo, upsert=True)
                    
                else:
                    logging.info(photo)
        element.clear()
    
    logging.info(f"Finished parsing the data")

mongo_photos = manage_mongo()
for path in PATHS:
    parse_file(path, mongo_photos)