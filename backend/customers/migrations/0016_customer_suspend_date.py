# Generated by Django 4.2.7 on 2023-12-21 11:24

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("customers", "0015_customer_shipping_instructions"),
    ]

    operations = [
        migrations.AddField(
            model_name="customer",
            name="suspend_date",
            field=models.DateField(
                default=datetime.datetime(
                    2023, 12, 21, 11, 24, 47, 869732, tzinfo=datetime.timezone.utc
                )
            ),
        ),
    ]
