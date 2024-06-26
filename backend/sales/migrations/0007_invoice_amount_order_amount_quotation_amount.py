# Generated by Django 4.2.7 on 2024-04-11 10:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sales', '0006_alter_invoiceitem_invoice_alter_orderitem_order_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='invoice',
            name='amount',
            field=models.DecimalField(decimal_places=2, default=0.0, editable=False, max_digits=16),
        ),
        migrations.AddField(
            model_name='order',
            name='amount',
            field=models.DecimalField(decimal_places=2, default=0.0, editable=False, max_digits=16),
        ),
        migrations.AddField(
            model_name='quotation',
            name='amount',
            field=models.DecimalField(decimal_places=2, default=0.0, editable=False, max_digits=16),
        ),
    ]
