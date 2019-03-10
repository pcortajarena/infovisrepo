import docker
import argparse
import logging
from shutil import rmtree
from configs import *

IMG_NAME = "mongoclient/mongoclient"
CONT_NAME = "mongo"
TAG = "latest"
PORTS = {'3000/tcp': 3000, '27017/tcp':27017}
DOCKER_VOLUME = commons_config["DEFAULT"]["DOCKER_VOLUME"]
VOLUMES = {DOCKER_VOLUME:{'bind': '/data/db', 'mode': 'rw'}}
client = docker.from_env()
logging.basicConfig(format=commons_config["DEFAULT"]["LOGGER_FORMAT"], level=logging.INFO)

def init():
    logging.info("Initializing a docker container")
    logging.info("Pulling a mongodb image")
    image = client.images.pull(IMG_NAME, TAG)
    logging.info("The image pulled")
    logging.info("Running the container")
    client.volumes.create(DOCKER_VOLUME)
    client.containers.run(IMG_NAME,
                detach=True,
                name=CONT_NAME,
                ports=PORTS,
                volumes=VOLUMES)

def run_container(name):
    logging.info(f"Running the container: {name}")
    container = client.containers.get(name)
    container.start()

def stop_container(name):
    logging.info(f"Stopping the container: {name}")
    container = client.containers.get(name)
    container.stop()
    logging.info(f"Container stopped")

def remove_container(name):
    logging.info(f"Removing the container: {name}")
    container = client.containers.get(name)
    container.remove()
    volume = client.volumes.get(DOCKER_VOLUME)
    volume.remove()
    logging.info(f"Container removed")

def run_default():
    run_container(CONT_NAME)

def stop_default():
    stop_container(CONT_NAME)

def remove_default():
    remove_container(CONT_NAME)

parser = argparse.ArgumentParser(description='Run mongodb in docker')
modes = {'run': run_default, 'stop': stop_default, 'init': init, 'remove': remove_default}
parser.add_argument('mode', 
                    default='run', 
                    const='run',
                    nargs='?',
                    choices=modes, 
                    help='Run mode')

args = parser.parse_args()
func = modes[args.mode]
func()
