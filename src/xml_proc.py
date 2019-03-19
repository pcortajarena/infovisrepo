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
OUT = commons_config["XML_PROC"]["OUTPUT_FILE"]

BULK_SIZE = int(commons_config['API']['BULK_SIZE'])
API_ENDPOINT = commons_config['API']['API_ENDPOINT']

URL_TEMPLATE = commons_config["XML_PROC"]["URL_TEMPLATE"]
DATEUPLOADED = 'dateuploaded'
DATE_MAP = commons_config['JSON_FORMAT']['DATE']
ID = "id"
ID_MAP = commons_config['JSON_FORMAT']['ID']

ATTRIBUTES = [ID, DATEUPLOADED, "views"]
URL_ATTRIBUTES = ['farm', ID, 'secret', 'server']
LATITUDE = commons_config['JSON_FORMAT']['LATITUDE']
LONGITUDE = commons_config['JSON_FORMAT']['LONGITUDE']
LOCATION = "location"
PHOTO = "photo"
LABELS = "labels"
URL = commons_config['JSON_FORMAT']['URL']
LABELS_OUT = commons_config["XML_PROC"]["LABELS_OUT"]

OWNER = "owner"
USERNAME = "username"
TITLE = "title"
URLS = "urls"
PHOTOPAGE_URL = "url"

USERNAME_MAP = commons_config['JSON_FORMAT']['USERNAME']
TITLE_MAP = commons_config['JSON_FORMAT']['TITLE']
PHOTOPAGE_URL_MAP = commons_config['JSON_FORMAT']['PHOTOPAGE_URL']

WRITE_TYPE = "file" # file | api


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
        photo[USERNAME_MAP] = element.find(OWNER).attrib[USERNAME]
        photo[PHOTOPAGE_URL_MAP] = element.find(URLS)[0].text
        photo[TITLE_MAP] = element.find(TITLE).text
        photo[LABELS] = labels

        return photo

    else:
        return None


def save_bulk(bulk):
    if WRITE_TYPE == "file":
        write_bulk(bulk)

    elif WRITE_TYPE == "api":
        send_bulk(bulk)


def write_bulk(bulk):
    logging.info("Appending the data")
    bulk = [json.dumps(x) for x in bulk]
    bulk_str = "\n".join(bulk) + "\n"
    with open(OUT, 'a+') as f:
        f.write(bulk_str)
    logging.info("The bulk appended")


def write_string(string):
    with open(OUT, 'a+') as f:
        f.write(string)


def send_bulk(bulk):
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
            labels_dict[label] = labels_dict[label] + 1 if label in labels_dict else 1

    return labels_dict


def write_labels(path, labels_dict):
    labels_dict = list(labels_dict.items())
    labels_dict.sort(key=lambda tup: tup[1], reverse=True)
    labels = [f"{x[0]}, {x[1]}" for x in labels_dict] 
    labels = '\n'.join(labels)
    logging.info(f"Writing labels into {path}")
    
    with open(path, 'w+') as f:
        f.write(labels)


def sort_file_lines(path, list_field, sort_field):
    logging.info(f"Sorting json file")
    out = {}
    with open(path) as f: 
        out[list_field] = [json.loads(x) for x in f.read().splitlines()] 

    out[list_field].sort(key=lambda k: int(k[sort_field]))
    with open(path, 'w+') as f:
        json.dump(out, f, sort_keys=True, indent=4)
    logging.info(f"File saved")


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

            if len(bulk) >= BULK_SIZE:
                save_bulk(bulk)
                bulk = []

        element.clear()

    save_bulk(bulk)
    logging.info(f"Finished parsing the data")


labels_dict = {}
for path in PATHS:
    parse_file(path, labels_dict)

sort_file_lines(OUT, "photos", "views")
write_labels(LABELS_OUT, labels_dict)
