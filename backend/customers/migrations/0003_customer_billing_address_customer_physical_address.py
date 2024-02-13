# Generated by Django 4.2.7 on 2023-12-21 10:13

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("customers", "0002_rename_customer_fax_number_customer_fax_number_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="customer",
            name="billing_address",
            field=models.TextField(default=""),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="customer",
            name="physical_address",
            field=models.TextField(default=""),
            preserve_default=False,
        ),
    ]
