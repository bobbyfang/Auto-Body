# Generated by Django 4.2.7 on 2024-01-17 15:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('customers', '0024_remove_customer_ck_number_remove_customer_vat_number_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='contactperson',
            name='id',
            field=models.AutoField(primary_key=True, serialize=False),
        ),
    ]