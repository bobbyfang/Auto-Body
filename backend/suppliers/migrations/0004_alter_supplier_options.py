# Generated by Django 4.2.7 on 2024-01-03 13:38

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('suppliers', '0003_remove_suppliercontactperson_customer_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='supplier',
            options={'ordering': ['-supplier_number']},
        ),
    ]
