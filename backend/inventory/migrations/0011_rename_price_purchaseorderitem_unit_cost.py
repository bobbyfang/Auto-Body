# Generated by Django 4.2.7 on 2023-12-27 09:44

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('inventory', '0010_purchaseorder_supplier'),
    ]

    operations = [
        migrations.RenameField(
            model_name='purchaseorderitem',
            old_name='price',
            new_name='unit_cost',
        ),
    ]
