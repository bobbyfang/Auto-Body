# Generated by Django 4.2.7 on 2024-01-03 12:08

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('customers', '0021_rename_customer_contactperson_customer_number'),
    ]

    operations = [
        migrations.RenameField(
            model_name='contactperson',
            old_name='customer_number',
            new_name='customer',
        ),
    ]