# Generated by Django 4.2.7 on 2024-02-20 10:32

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('inventory', '0019_alter_product_options_alter_productprice_product'),
    ]

    operations = [
        migrations.RenameField(
            model_name='productsupplieritem',
            old_name='item_number',
            new_name='supplier_number',
        ),
    ]