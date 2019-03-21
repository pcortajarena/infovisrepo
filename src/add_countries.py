import json
import pycountry
import reverse_geocoder as rg
from tqdm import tqdm

path = "NUS.json"
path2 = "NUSc.json"
field = "photos"

with open(path) as f:
    out = json.load(f)

chunkSize = 1000
for i in tqdm(range(0, len(out[field]), chunkSize)):
    coordinates = []
    for photo in out[field][i:i+chunkSize]:
        coordinates.append((photo['latitude'] ,photo['longitude']))
    
    results = rg.search(coordinates)

    for ichunk in range(0, len(results)):
        result = results[ichunk]
        photo = out[field][i+ichunk]

        if result['cc'] != 'US':
            country = pycountry.countries.get(alpha_2=result['cc'])
            if country != None:
                photo['location'] = country.name
            else:
                photo['location'] = ""
        
        else:
            photo['location'] = result['admin1']   


with open(path2, "w+") as f:
    json.dump(out, f, sort_keys=True, indent=4)