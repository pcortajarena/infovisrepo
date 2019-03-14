from datetime import datetime
import xml.etree.ElementTree as etree
from xml.etree.ElementTree import Element
import lxml.etree as letree
import json
import logging
import aiohttp
from configs import *
from aiohttp import ClientSession
import asyncio

logging.basicConfig(format=commons_config["DEFAULT"]["LOGGER_FORMAT"], level=logging.INFO)

PATHS = [x.strip() for x in commons_config["XML_PROC"]["INPUT_FILES"].split(',')]

BULK_SIZE = int(commons_config['API']['BULK_SIZE'])
API_ENDPOINT = commons_config['API']['API_ENDPOINT']

URL_TEMPLATE = commons_config["XML_PROC"]["URL_TEMPLATE"]
DATEUPLOADED = 'dateuploaded'
DATE_MAP = commons_config['JSON_FORMAT']['DATE']
ID = "id"
ID_MAP = commons_config['JSON_FORMAT']['ID']

ATTRIBUTES = [ID, DATEUPLOADED, "views"]
URL_ATTRIBUTES = ['farm', ID, 'secret', 'server']
LATITUDE = "latitude"
LONGITUDE = "longitude"
LOCATION = "location"
PHOTO = "photo"
LABELS = "labels"
URL = "url"
LABELS_OUT = commons_config["XML_PROC"]["LABELS_OUT"]

def parse_element(element):
    location_element = element.find(LOCATION)
    labels_element = element.find(LABELS)
    if location_element != None and labels_element != None:
        photo = {}
        labels = []
        url = URL_TEMPLATE

        for attrib in ATTRIBUTES:
            value = element.attrib[attrib]
            if attrib == DATEUPLOADED:
                photo[DATE_MAP] = datetime.fromtimestamp(
                    int(value)).isoformat()
            elif attrib == ID:
                photo[ID_MAP] = int(value)
            elif value.isdigit():
                photo[attrib] = int(value)
            else:
                photo[attrib] = value

        for attrib in URL_ATTRIBUTES:
            url = url.replace(f"{{{attrib}}}", element.attrib[attrib])

        for label in labels_element:
            labels.append(label.text)

        photo[URL] = url
        photo[LATITUDE] = float(location_element.attrib[LATITUDE])
        photo[LONGITUDE] = float(location_element.attrib[LONGITUDE])
        photo[LABELS] = labels

        return photo

    else:
        return None


def send(bulk):
    logging.info("Sending the data")
    loop = asyncio.get_event_loop()
    loop.run_until_complete(async_send(bulk))
    logging.info("The bulk sent")


async def async_send(request):
    async with ClientSession() as session:
        async with session.post(API_ENDPOINT, json=request) as r:
            json_body = await r.json()
    logging.info(f"Response status: {r.status}")
    logging.info(f"JSON body: {json_body}")


def update_labels(new_labels, labels_dict):
    for label in new_labels:
        if label != None:
            labels_dict[label] = True

    return labels_dict


def write_labels(path, labels_dict):
    labels = '\n'.join(labels_dict.keys())
    logging.info(f"Writing labels into {path}")
    
    with open(path, 'a') as f:
        f.write(labels)


def parse_file(xml_path, labels_dict):
    logging.info(f"Parsing {xml_path} and storing entries in the database")
    context = etree.iterparse(xml_path, events=("start", "end"))

    bulk = []
    
    for event, element in context:
        if event == 'start' and element.tag == PHOTO:
            photo = parse_element(element)

            if photo != None:
                bulk.append(photo)
                labels_dict = update_labels(photo[LABELS], labels_dict)
                # print(labels_dict)

            if len(bulk) >= BULK_SIZE:
                send(bulk)
                bulk = []

        element.clear()

    #send(bulk)
    logging.info(f"Finished parsing the data")


labels_dict = {}
for path in PATHS:
    parse_file(path, labels_dict)

print(labels_dict)
write_labels(LABELS_OUT, labels_dict)
