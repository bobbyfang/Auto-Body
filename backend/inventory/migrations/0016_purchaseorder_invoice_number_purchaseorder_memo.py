# Generated by Django 4.2.7 on 2024-01-03 08:09

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("inventory", "0015_purchaseorderitem_total"),
    ]

    operations = [
        migrations.AddField(
            model_name="purchaseorder",
            name="invoice_number",
            field=models.CharField(default="", max_length=64),
        ),
        migrations.AddField(
            model_name="purchaseorder",
            name="memo",
            field=models.TextField(blank=True, default=""),
        ),
    ]
