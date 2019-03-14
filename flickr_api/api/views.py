from rest_framework import viewsets
from url_filter.integrations.drf import DjangoFilterBackend
from rest_framework.pagination import PageNumberPagination
from rest_framework.filters import OrderingFilter
from rest_framework_bulk import BulkModelViewSet

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
    filter_fields = ('id', 'date', 'longitude', 'latitude')
    ordering_fields = ('date', 'views')
    http_method_names = ['get', 'post']
    pagination_class = PageNumberSetPagination
