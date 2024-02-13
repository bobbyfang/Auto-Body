from django.db import models
from django.contrib.auth.models import User


class ReferenceModel(models.Model):
    reference_number = models.CharField(
        primary_key=True, max_length=9, default="", editable=False
    )
    created = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.PROTECT)

    class Meta:
        abstract = True
