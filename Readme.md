# How to run it

- Install [docker](https://www.docker.com/get-started) 
- Place the data in the *data* folder (change paths in *res/commons.ini* if needed)
- To set up a database and run API go to *infovisrepo* and run: 
  - ```sudo docker-compose build```
  - ```sudo docker-compose up```
- Leave it running there 
- Go to the *src* directory and install dependencies using *pip install -r requirements.txt* 
- Run *xml_proc.py* to fill the database with the xml data (ca. 15min)
- Call *API* e.g.
  - Get all records: *localhost:8000/photos*
  - Filter by longitude: *localhost:8000/photos?longitude__range=4.80,5.00*
  - Order by views: *localhost:8000/photos?ordering=-views*
  - Change page: *localhost:8000/photos/?page=2*