# Generated by Django 4.2.7 on 2024-02-13 11:29

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("inventory", "0017_product_manual_prices_alter_productprice_product"),
    ]

    operations = [
        migrations.RenameField(
            model_name="product",
            old_name="manual_prices",
            new_name="manual_price",
        ),
    ]
