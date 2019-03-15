from rest_framework import viewsets
from url_filter.integrations.drf import DjangoFilterBackend
from rest_framework.pagination import PageNumberPagination
from rest_framework.filters import OrderingFilter
from rest_framework_bulk import BulkModelViewSet
from django.views import View
from django.http import HttpResponse
from django.template import Context, Template
import requests
import json

from .models import Photo
from .serializers import PhotoSerializer
# Create your views here.


class PageNumberSetPagination(PageNumberPagination):
    page_size = 25
    max_page_size = 1000
    page_size_query_param = 'page_size'


class PhotoViewSet(BulkModelViewSet):
    def allow_bulk_destroy(self, qs, filtered):
        """Don't forget to fine-grain this method"""

    model = Photo
    queryset = Photo.objects.all()
    serializer_class = PhotoSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter, ]
    filter_fields = ('id', 'date', 'longitude', 'latitude', "labels")
    ordering_fields = ('date', 'views')
    http_method_names = ['get', 'post']
    pagination_class = PageNumberSetPagination


class MainView(View):

    def get(self, request, *args, **kwargs):

        url = 'http://localhost:8000/photos/' \
              '?latitude__range=24.9493%2C49.5904' \
              '&longitude__range=-125.0011%2C-66.9326&page=5'

        r = requests.get(url)
        r = json.loads(r.text)
        n = r['next']

        while n is not None:
            rn = requests.get(n)
            rn = json.loads(rn.text)
            for el in rn['results']:
                r['results'].append(el)
            n = rn['next']

        return HttpResponse(r['results'])

        # t = Template("<html><body>It is now {{ current_date }}.</body></html>")
        # html = t.render(Context({'current_date': 'hola'}))
