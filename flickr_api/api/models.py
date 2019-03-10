from djongo import models

# Create your models here.
class Photo(models.Model):
    id = models.IntegerField(primary_key=True, unique=True, editable=False)
    date = models.CharField(max_length=32)
    url = models.CharField(max_length=128)
    longitude = models.FloatField()
    latitude = models.FloatField()
    labels = models.ListField()
    views = models.IntegerField()

    def __str__(self):
        return self.url
