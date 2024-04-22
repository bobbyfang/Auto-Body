from typing import Any
from django.db import models
from datetime import datetime


class ReferenceNumberField(models.CharField):
    def __init__(self, *args, **kwargs):
        kwargs["max_length"] = 10  # YYMMDDXXX has 10 characters
        kwargs["unique"] = True
        kwargs["editable"] = False
        super().__init__(*args, **kwargs)

    def pre_save(self, model_instance: models.Model, add: bool) -> Any:
        date_prefix = datetime.now().strftime("%y%m%d")
        last_reference = (
            model_instance.__class__.objects.filter(
                reference_number__startswith=date_prefix
            )
            .order_by("-reference_number")
            .first()
        )
        if last_reference:
            last_reference_number = int(last_reference.reference_number[-3:])
            new_reference_number = last_reference_number + 1
        else:
            new_reference_number = 1
        model_instance.reference_number = f"{date_prefix}{new_reference_number:03d}"
        return model_instance.reference_number
