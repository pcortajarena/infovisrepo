# How to run it

- Install [docker](https://www.docker.com/get-started) 
- Install dependencies using *conda* and *pip*
- Place the data in *data*
- Go to *src* run ```sudo python mongo_docker.py init``` [Linux command]
- Run *xml_proc*
- Go to *infovisrepo* run: 
  - ```python manage.py makemigrations api```
  - ```python manage.py migrate```
  - ```python manage.py runserver```
- Call *API* e.g.
  - Get all records: *localhost:8000/photos*
  - Filter by longitude: *localhost:8000/photos?longitude__range=4.80,5.00*
  - Order by views: *localhost:8000/photos?ordering=-views*
  - Change page: *localhost:8000/photos/?page=2*
- Run/stop docker: ```sudo python mongo_docker.py run/stop```