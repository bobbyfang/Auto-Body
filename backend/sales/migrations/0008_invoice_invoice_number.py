# Generated by Django 4.2.7 on 2024-04-23 08:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sales', '0007_invoice_amount_order_amount_quotation_amount'),
    ]

    operations = [
        migrations.AddField(
            model_name='invoice',
            name='invoice_number',
            field=models.IntegerField(default=1, editable=False, unique=True),
        ),
    ]
