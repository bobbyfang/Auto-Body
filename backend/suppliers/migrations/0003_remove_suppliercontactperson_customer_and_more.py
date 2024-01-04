# Generated by Django 4.2.7 on 2024-01-03 13:36

from django.db import migrations, models
import django.db.models.deletion
import suppliers.models


class Migration(migrations.Migration):

    dependencies = [
        ('suppliers', '0002_supplier_memo'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='suppliercontactperson',
            name='customer',
        ),
        migrations.AddField(
            model_name='suppliercontactperson',
            name='supplier',
            field=models.ForeignKey(default=suppliers.models.Supplier.get_default_pk, on_delete=django.db.models.deletion.CASCADE, related_name='contact_persons', to='suppliers.supplier'),
        ),
    ]