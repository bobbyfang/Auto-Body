# Generated by Django 4.2.7 on 2023-12-21 11:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('customers', '0014_customer_active'),
    ]

    operations = [
        migrations.AddField(
            model_name='customer',
            name='shipping_instructions',
            field=models.TextField(blank=True, default=''),
        ),
    ]