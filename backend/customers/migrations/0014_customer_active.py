# Generated by Django 4.2.7 on 2023-12-21 11:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('customers', '0013_customer_email'),
    ]

    operations = [
        migrations.AddField(
            model_name='customer',
            name='active',
            field=models.BooleanField(default=True),
        ),
    ]
