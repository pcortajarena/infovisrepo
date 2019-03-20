# importing the requests library 
import requests 
import asyncio
import json
import aiohttp
from tqdm import tqdm

photos = []
non_avail = []
path = "data/NUS.json"
non_avail_path = "data/nonavailable.json"
with open('data/jsonNUS.json') as f:
    data = json.load(f)

async def check_available_async(xjson):
    url = xjson["url"]
    conn = aiohttp.TCPConnector(verify_ssl=False)
    async with aiohttp.ClientSession(connector=conn) as session:
        global count
        try:
            async with session.get(url) as response:  
                if response.history and response.history[0].status == 302:
                    non_avail.append(xjson)
                    return
                
                photos.append(xjson)

        except Exception as e:
            print(e)

# better but slower
def check_available(xjsons):
    
    for xjson in xjsons:
        url = xjson["url"]
        r = requests.get(url = url, params = {})
        if not r.history:
            photos.append(xjson)

        elif r.history[0].status_code == 302:
            non_avail.append(xjson)


if __name__ == "__main__":        
    chunkSize = 350
    for i in tqdm(range(0, len(data["photos"]), chunkSize)):
        # check_available(data["photos"][i:i+chunkSize])
        loop = asyncio.get_event_loop()
        tasks = [loop.create_task(check_available_async(xjson)) for xjson in data["photos"][i:i+chunkSize]]
        loop.run_until_complete(asyncio.wait(tasks))
    loop.close()

    photos_dict = {}
    photos_dict['photos'] = photos

    with open(path, 'w+') as f:
        json.dump(photos_dict, f, sort_keys=True, indent=4)

    non_dict = {}
    non_dict['photos'] = non_avail

    with open(non_avail_path, 'w+') as f:
        json.dump(non_dict, f, sort_keys=True, indent=4)
