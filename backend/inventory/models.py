from datetime import datetime

from django.db import models
from django.contrib.auth.models import User

from suppliers.models import Supplier

from common.utils.formatting import convertDateToReferenceHeader
# Create your models here.


class Product(models.Model):
    product_number = models.CharField(primary_key=True, max_length=20)
    description = models.TextField(default="")
    oem_number = models.CharField(max_length=128, blank=True)

    make = models.CharField(max_length=64)
    model = models.CharField(max_length=64)
    year = models.CharField(max_length=64)
    facelift = models.BooleanField(default=False)

    units = models.CharField(max_length=64)

    quantity = models.IntegerField(default=0)
    safety_quantity = models.IntegerField(default=0)
    in_transit = models.IntegerField(default=0)
    eta = models.DateField(default=None,
                           null=True,
                           blank=True)

    fob_cost = models.DecimalField(default=0.0,
                                   decimal_places=2,
                                   max_digits=16)
    retail_price = models.DecimalField(default=0.0,
                                       decimal_places=2,
                                       max_digits=16)

    manual_prices = models.BooleanField
    discountable = models.BooleanField(default=False)
    memo = models.TextField(default="", blank=True)
    inactive = models.BooleanField(default=False)

    def __str__(self):
        return str(self.product_number)


class PriceLevel(models.Model):
    level_name = models.CharField(primary_key=True, max_length=64)
    markdown_percentage = models.DecimalField(default=0.0,
                                              max_digits=5,
                                              decimal_places=2)

    def __str__(self):
        return str(self.level_name)


class ProductPrice(models.Model):
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    level = models.ForeignKey(PriceLevel, on_delete=models.PROTECT)
    price = models.DecimalField(default=0.0,
                                max_digits=16,
                                decimal_places=2)

    class Meta:
        constraints = [models.UniqueConstraint(
            fields=['product', 'level'], name='unique_product_level_price'
        )]

    def __str__(self):
        return str(self.level.level_name)


class ProductLocation(models.Model):
    location = models.CharField(max_length=64, default="")
    date = models.DateTimeField(auto_now_add=True)
    inactive = models.BooleanField(default=False)
    product = models.ForeignKey(Product, on_delete=models.PROTECT)


class ProductSupplierItem(models.Model):
    item_number = models.CharField(max_length=64, default="")
    supplier = models.ForeignKey(Supplier, on_delete=models.PROTECT)
    product = models.ForeignKey(Product, on_delete=models.PROTECT)


class InventoryQuote(models.Model):
    reference_number = models.CharField(primary_key=True,
                                        max_length=9,
                                        default="",
                                        editable=False)
    created = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.PROTECT)

    def save(self, *args, **kwargs):
        if not self.reference_number:
            today = datetime.today()
            today_count = len(InventoryQuote.objects.filter(created__date=today))
            reference_header = convertDateToReferenceHeader(today)
            self.reference_number = f'{reference_header}{today_count+1:03}'
        super(InventoryQuote, self).save(*args, **kwargs)

    def __str__(self):
        return str(self.reference_number)


class InventoryQuoteItem(models.Model):
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    inventory_quote = models.ForeignKey(InventoryQuote, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.product.product_number} ({self.inventory_quote.reference_number})'


class InventoryQuoteItemPrice(models.Model):
    inventory_quote_item = models.ForeignKey(InventoryQuoteItem, on_delete=models.CASCADE)
