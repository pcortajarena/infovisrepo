from rest_framework import serializers
from .models import Photo

class PhotoSerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.IntegerField()
    labels = serializers.ListField()
    class Meta:
        model = Photo
        fields = '__all__' 