# Generated by Django 4.2.7 on 2023-12-22 15:13

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('suppliers', '0002_supplier_memo'),
    ]

    operations = [
        migrations.CreateModel(
            name='PriceLevel',
            fields=[
                ('level_name', models.CharField(max_length=64, primary_key=True, serialize=False)),
                ('markdown_percentage', models.DecimalField(decimal_places=2, default=0.0, max_digits=5)),
            ],
        ),
        migrations.CreateModel(
            name='Product',
            fields=[
                ('product_number', models.CharField(max_length=20, primary_key=True, serialize=False)),
                ('description', models.TextField(default='')),
                ('oem_number', models.CharField(blank=True, max_length=128)),
                ('make', models.CharField(max_length=64)),
                ('model', models.CharField(max_length=64)),
                ('year', models.CharField(max_length=64)),
                ('facelift', models.BooleanField(default=False)),
                ('units', models.CharField(max_length=64)),
                ('quantity', models.IntegerField(default=0)),
                ('safety_quantity', models.IntegerField(default=0)),
                ('in_transit', models.IntegerField(default=0)),
                ('eta', models.DateField(blank=True, default=None, null=True)),
                ('fob_cost', models.DecimalField(decimal_places=2, default=0.0, max_digits=16)),
                ('retail_price', models.DecimalField(decimal_places=2, default=0.0, max_digits=16)),
                ('discountable', models.BooleanField(default=False)),
                ('memo', models.TextField(blank=True, default='')),
                ('inactive', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='ProductSupplierItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('item_number', models.CharField(default='', max_length=64)),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='inventory.product')),
                ('supplier', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='suppliers.supplier')),
            ],
        ),
        migrations.CreateModel(
            name='ProductPrice',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('price', models.DecimalField(decimal_places=2, default=0.0, max_digits=16)),
                ('level', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='inventory.pricelevel')),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='inventory.product')),
            ],
        ),
        migrations.CreateModel(
            name='ProductLocation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('location', models.CharField(default='', max_length=64)),
                ('date', models.DateTimeField(auto_now_add=True)),
                ('inactive', models.BooleanField(default=False)),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='inventory.product')),
            ],
        ),
        migrations.AddConstraint(
            model_name='productprice',
            constraint=models.UniqueConstraint(fields=('product', 'level'), name='unique_product_level_price'),
        ),
    ]
