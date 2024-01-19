# Generated by Django 4.2.7 on 2024-01-17 14:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('customers', '0023_alter_contactperson_customer'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='customer',
            name='CK Number',
        ),
        migrations.RemoveField(
            model_name='customer',
            name='VAT Number',
        ),
        migrations.AddField(
            model_name='customer',
            name='company_key_number',
            field=models.CharField(blank=True, default='', max_length=32, verbose_name='CK Number'),
        ),
        migrations.AddField(
            model_name='customer',
            name='vat_number',
            field=models.CharField(blank=True, default='', max_length=10, verbose_name='VAT Number'),
        ),
    ]