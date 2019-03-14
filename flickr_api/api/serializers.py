from rest_framework import serializers
from rest_framework_bulk import BulkListSerializer, BulkSerializerMixin
from .models import Photo

class PhotoSerializer(BulkSerializerMixin, serializers.ModelSerializer ):
    id = serializers.IntegerField()
    labels = serializers.ListField()
    class Meta:
        model = Photo
        fields = '__all__' 
        list_serializer_class = BulkListSerializer