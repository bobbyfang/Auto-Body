# Generated by Django 4.2.7 on 2024-04-09 10:06

import common.abstract.fields
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('inventory', '0022_alter_productsupplieritem_product_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='inventoryquote',
            name='reference_number',
            field=common.abstract.fields.ReferenceNumberField(max_length=10, primary_key=True, serialize=False, unique=True),
        ),
        migrations.AlterField(
            model_name='productlocation',
            name='product',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='locations', to='inventory.product'),
        ),
        migrations.AlterField(
            model_name='purchaseorder',
            name='reference_number',
            field=common.abstract.fields.ReferenceNumberField(max_length=10, primary_key=True, serialize=False, unique=True),
        ),
    ]