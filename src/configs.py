import configparser

XML_CONFIG_FILE = "../res/xml_proc.ini"
COMMONS_CONFIG_FILE = "../res/commons.ini"

xml_config = configparser.ConfigParser()
xml_config.read(XML_CONFIG_FILE)
commons_config = configparser.ConfigParser()
commons_config.read(COMMONS_CONFIG_FILE)