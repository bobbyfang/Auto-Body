# Generated by Django 4.2.7 on 2024-04-09 10:06

import common.abstract.fields
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('sales', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='invoice',
            name='reference_number',
            field=common.abstract.fields.ReferenceNumberField(max_length=10, primary_key=True, serialize=False, unique=True),
        ),
        migrations.AlterField(
            model_name='order',
            name='reference_number',
            field=common.abstract.fields.ReferenceNumberField(max_length=10, primary_key=True, serialize=False, unique=True),
        ),
        migrations.AlterField(
            model_name='quotation',
            name='reference_number',
            field=common.abstract.fields.ReferenceNumberField(max_length=10, primary_key=True, serialize=False, unique=True),
        ),
    ]