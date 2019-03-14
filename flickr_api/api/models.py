from django.db import models
from django.contrib.postgres.fields import ArrayField, JSONField

# Create your models here.
class Photo(models.Model):

    id = models.BigIntegerField(primary_key=True, unique=True, editable=False)
    date = models.CharField(max_length=32)
    url = models.CharField(max_length=128)
    longitude = models.FloatField()
    latitude = models.FloatField()
    labels = ArrayField(models.CharField(max_length=64), blank=True)
    views = models.IntegerField()

    def __str__(self):
        return self.id
