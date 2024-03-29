# Generated by Django 4.2.7 on 2024-01-03 08:55

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("customers", "0020_customer_customer_level"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("inventory", "0016_purchaseorder_invoice_number_purchaseorder_memo"),
    ]

    operations = [
        migrations.CreateModel(
            name="Invoice",
            fields=[
                (
                    "reference_number",
                    models.CharField(
                        default="",
                        editable=False,
                        max_length=9,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                ("created", models.DateTimeField(auto_now_add=True)),
                (
                    "total",
                    models.DecimalField(
                        decimal_places=2, default=0.0, editable=False, max_digits=16
                    ),
                ),
                (
                    "vat",
                    models.DecimalField(
                        decimal_places=2, default=0.0, editable=False, max_digits=16
                    ),
                ),
                ("memo", models.TextField(blank=True, default="")),
                (
                    "customer",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="customers.customer",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "abstract": False,
            },
        ),
        migrations.CreateModel(
            name="Order",
            fields=[
                (
                    "reference_number",
                    models.CharField(
                        default="",
                        editable=False,
                        max_length=9,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                ("created", models.DateTimeField(auto_now_add=True)),
                (
                    "total",
                    models.DecimalField(
                        decimal_places=2, default=0.0, editable=False, max_digits=16
                    ),
                ),
                (
                    "vat",
                    models.DecimalField(
                        decimal_places=2, default=0.0, editable=False, max_digits=16
                    ),
                ),
                ("memo", models.TextField(blank=True, default="")),
                (
                    "customer",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="customers.customer",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "abstract": False,
            },
        ),
        migrations.CreateModel(
            name="Quotation",
            fields=[
                (
                    "reference_number",
                    models.CharField(
                        default="",
                        editable=False,
                        max_length=9,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                ("created", models.DateTimeField(auto_now_add=True)),
                (
                    "total",
                    models.DecimalField(
                        decimal_places=2, default=0.0, editable=False, max_digits=16
                    ),
                ),
                (
                    "vat",
                    models.DecimalField(
                        decimal_places=2, default=0.0, editable=False, max_digits=16
                    ),
                ),
                ("memo", models.TextField(blank=True, default="")),
                (
                    "customer",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="customers.customer",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "abstract": False,
            },
        ),
        migrations.CreateModel(
            name="QuotationItem",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "price",
                    models.DecimalField(
                        decimal_places=2, default=0.0, editable=False, max_digits=16
                    ),
                ),
                (
                    "vat",
                    models.DecimalField(
                        decimal_places=2, default=0.0, editable=False, max_digits=16
                    ),
                ),
                (
                    "subtotal",
                    models.DecimalField(
                        decimal_places=2, default=0.0, editable=False, max_digits=16
                    ),
                ),
                (
                    "product",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT,
                        to="inventory.product",
                    ),
                ),
                (
                    "quotation",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="sales.quotation",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="OrderItem",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "price",
                    models.DecimalField(
                        decimal_places=2, default=0.0, editable=False, max_digits=16
                    ),
                ),
                (
                    "vat",
                    models.DecimalField(
                        decimal_places=2, default=0.0, editable=False, max_digits=16
                    ),
                ),
                (
                    "subtotal",
                    models.DecimalField(
                        decimal_places=2, default=0.0, editable=False, max_digits=16
                    ),
                ),
                (
                    "order",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="sales.order"
                    ),
                ),
                (
                    "product",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT,
                        to="inventory.product",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="InvoiceItem",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "price",
                    models.DecimalField(
                        decimal_places=2, default=0.0, editable=False, max_digits=16
                    ),
                ),
                (
                    "vat",
                    models.DecimalField(
                        decimal_places=2, default=0.0, editable=False, max_digits=16
                    ),
                ),
                (
                    "subtotal",
                    models.DecimalField(
                        decimal_places=2, default=0.0, editable=False, max_digits=16
                    ),
                ),
                (
                    "invoice",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="sales.invoice"
                    ),
                ),
                (
                    "product",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT,
                        to="inventory.product",
                    ),
                ),
            ],
        ),
    ]
