# Generated by Django 4.2.7 on 2023-12-27 09:26

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('inventory', '0008_purchaseorderitems'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='PurchaseOrderItems',
            new_name='PurchaseOrderItem',
        ),
    ]
