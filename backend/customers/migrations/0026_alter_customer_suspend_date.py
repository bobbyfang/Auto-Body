# Generated by Django 4.2.7 on 2024-05-23 11:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('customers', '0025_alter_contactperson_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customer',
            name='suspend_date',
            field=models.DateTimeField(blank=True, default='', null=True),
        ),
    ]
