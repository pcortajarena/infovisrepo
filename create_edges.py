import json
from tqdm import tqdm

from shapely.geometry import Point
from shapely.geometry.polygon import Polygon
from shapely.geometry.multipolygon import MultiPolygon

if __name__ == '__main__':

    with open('data/edgeFeaturesNUS.txt', 'r') as f:
        lines = f.read().splitlines()

    lines = lines[1:-1]
    total = len(lines)

    pbar = tqdm(total=total)
    edges = {}

    for line in lines:
        line = line.split(' ')
        if (line[2] or line[3] or line[4] or line[5]) != '0':
            if line[0] not in edges:
                edges[line[0]] = []
                edges[line[0]].append(line[1])
            else:
                edges[line[0]].append(line[1])
        pbar.update(1)

    with open('visualizations_tools/bubble_map/NUS.json') as f:
        data = json.load(f)

    with open('visualizations_tools/bubble_map/world.json') as f:
        world = json.load(f)

    polygons = []
    for country in world['features']:
        pols = []
        for region in country['geometry']['coordinates']:
            if country['geometry']['type'] == 'MultiPolygon':
                pols.append(Polygon(region[0]))
            else:
                pols = Polygon(region)
        if country['geometry']['type'] == 'MultiPolygon':
            pols = MultiPolygon(pols)
        polygons.append(pols)

    latlon_data = {}
    for el in data['photos']:
        latlon_data[el['id']] = [el['latitude'], el['longitude']]

    edges_copy = {}
    total = len(edges.keys())
    pbar = tqdm(total=total)

    for k in edges.keys():
        if int(k) in latlon_data:
            edges_copy[k] = []
            # p = Point(latlon_data[int(k)][0], latlon_data[int(k)][1])
            for v in edges[k]:
                if int(v) in latlon_data:
                    edges_copy[k].append([latlon_data[int(v)][0],
                                          latlon_data[int(v)][1]])
                    #p2 = Point(latlon_data[int(v)][0], latlon_data[int(v)][1])
                    # for pol in polygons:
                    #     if pol.contains(p) and pol.contains(p2):
                    #         edges_copy[k].append([latlon_data[int(v)][0],
                    #                             latlon_data[int(v)][1]])
        pbar.update(1)

    with open('data/edges_copy.json', 'w') as outfile:
        json.dump(edges_copy, outfile)
