from django.db import models
from django.contrib.auth.models import User

from common.abstract.fields import ReferenceNumberField


class ReferenceModel(models.Model):
    reference_number = ReferenceNumberField(primary_key=True)
    created = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.PROTECT)

    class Meta:
        abstract = True
