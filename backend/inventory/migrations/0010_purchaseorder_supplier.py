# Generated by Django 4.2.7 on 2023-12-27 09:42

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("suppliers", "0002_supplier_memo"),
        ("inventory", "0009_rename_purchaseorderitems_purchaseorderitem"),
    ]

    operations = [
        migrations.AddField(
            model_name="purchaseorder",
            name="supplier",
            field=models.ForeignKey(
                default=None,
                on_delete=django.db.models.deletion.PROTECT,
                to="suppliers.supplier",
            ),
            preserve_default=False,
        ),
    ]
