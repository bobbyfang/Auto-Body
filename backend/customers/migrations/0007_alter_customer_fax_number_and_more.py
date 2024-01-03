# Generated by Django 4.2.7 on 2023-12-21 10:57

from django.db import migrations
import phonenumber_field.modelfields


class Migration(migrations.Migration):

    dependencies = [
        ('customers', '0006_alter_contactperson_contact_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customer',
            name='fax_number',
            field=phonenumber_field.modelfields.PhoneNumberField(blank=True, default='', max_length=128, region=None),
        ),
        migrations.AlterField(
            model_name='customer',
            name='mobile_number',
            field=phonenumber_field.modelfields.PhoneNumberField(blank=True, default='', max_length=128, region=None),
        ),
    ]