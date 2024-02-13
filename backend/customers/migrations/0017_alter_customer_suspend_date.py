# Generated by Django 4.2.7 on 2023-12-21 11:24

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):
    dependencies = [
        ("customers", "0016_customer_suspend_date"),
    ]

    operations = [
        migrations.AlterField(
            model_name="customer",
            name="suspend_date",
            field=models.DateField(default=django.utils.timezone.now),
        ),
    ]
