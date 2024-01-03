# Generated by Django 4.2.7 on 2024-01-03 13:17

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('customers', '0022_rename_customer_number_contactperson_customer'),
    ]

    operations = [
        migrations.AlterField(
            model_name='contactperson',
            name='customer',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='contact_persons', to='customers.customer'),
        ),
    ]
