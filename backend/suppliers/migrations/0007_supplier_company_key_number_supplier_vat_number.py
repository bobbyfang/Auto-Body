# Generated by Django 4.2.7 on 2024-06-03 10:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('suppliers', '0006_rename_address_supplier_physical_address_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='supplier',
            name='company_key_number',
            field=models.TextField(blank=True, default=''),
        ),
        migrations.AddField(
            model_name='supplier',
            name='vat_number',
            field=models.TextField(blank=True, default=''),
        ),
    ]
