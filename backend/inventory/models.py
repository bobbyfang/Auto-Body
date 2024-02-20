from datetime import datetime

from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

from suppliers.models import Supplier

from common.utils.formatting import convertDateToReferenceHeader, lastRefVariable
from common.abstract.models import ReferenceModel
# Create your models here.


class Product(models.Model):
    class Meta:
        ordering = ["product_number"]

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
    eta = models.DateField(default=None, null=True, blank=True)

    fob_cost = models.DecimalField(default=0.0, decimal_places=2, max_digits=16)
    retail_price = models.DecimalField(default=0.0, decimal_places=2, max_digits=16)

    manual_price = models.BooleanField(default=False)
    discountable = models.BooleanField(default=False)
    memo = models.TextField(default="", blank=True)
    inactive = models.BooleanField(default=False)

    def __str__(self):
        return str(self.product_number)


class PriceLevel(models.Model):
    level_name = models.CharField(primary_key=True, max_length=64)
    markdown_percentage = models.DecimalField(
        default=0.0, max_digits=5, decimal_places=2
    )

    @classmethod
    def get_default_pk(cls):
        price_level, _ = cls.objects.get_or_create(
            level_name="A", defaults={"markdown_percentage": 0.0}
        )
        return price_level.pk

    def __str__(self):
        return str(self.level_name)


class ProductPrice(models.Model):
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="prices"
    )
    level = models.ForeignKey(PriceLevel, on_delete=models.PROTECT)
    price = models.DecimalField(default=0.0, max_digits=16, decimal_places=2)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["product", "level"], name="unique_product_level_price"
            )
        ]

    def __str__(self):
        return str(
            f"{self.product.product_number} {self.level.level_name} Price (R{self.price})"
        )


@receiver(post_save, sender=Product)
def create_product_prices(sender, instance, created, **kwargs):
    if created:
        price_levels = PriceLevel.objects.all()
        for price_level in price_levels:
            ProductPrice.objects.create(
                product=instance,
                level=price_level,
                price=(
                    1
                    if instance.manual_price
                    else (100 - price_level.markdown_percentage)
                )
                * instance.retail_price,
            )


class ProductLocation(models.Model):
    location = models.CharField(max_length=64, default="")
    date = models.DateTimeField(auto_now_add=True)
    inactive = models.BooleanField(default=False)
    product = models.ForeignKey(Product, on_delete=models.PROTECT)


class ProductSupplierItem(models.Model):
    item_number = models.CharField(max_length=64, default="")
    supplier = models.ForeignKey(Supplier, on_delete=models.PROTECT)
    product = models.ForeignKey(Product, on_delete=models.PROTECT)


class InventoryQuote(ReferenceModel):
    def save(self, *args, **kwargs):
        if not self.reference_number:
            today = datetime.today()
            # today_count = len(InventoryQuote.objects.filter(created__date=today))
            last_ref_number = lastRefVariable(InventoryQuote)
            reference_header = convertDateToReferenceHeader(today)
            self.reference_number = f"{reference_header}{last_ref_number+1:03}"
        super(InventoryQuote, self).save(*args, **kwargs)

    def __str__(self):
        return str(self.reference_number)


class InventoryQuoteItem(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    inventory_quote = models.ForeignKey(InventoryQuote, on_delete=models.CASCADE)

    def __str__(self):
        return (
            f"{self.product.product_number} ({self.inventory_quote.reference_number})"
        )


class PurchaseOrder(ReferenceModel):
    supplier = models.ForeignKey(Supplier, on_delete=models.PROTECT)
    invoice_number = models.CharField(max_length=64, default="")
    memo = models.TextField(default="", blank=True)

    def save(self, *args, **kwargs):
        if not self.reference_number:
            today = datetime.today()
            # today_count = len(InventoryQuote.objects.filter(created__date=today))
            last_ref_number = lastRefVariable(PurchaseOrder)
            reference_header = convertDateToReferenceHeader(today)
            self.reference_number = f"{reference_header}{last_ref_number+1:03}"
        super(PurchaseOrder, self).save(*args, **kwargs)

    def __str__(self):
        return str(self.reference_number)


class PurchaseOrderItem(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    unit_cost = models.DecimalField(default=0.0, decimal_places=2, max_digits=16)
    quantity = models.IntegerField(default=0)
    purchase_order = models.ForeignKey(PurchaseOrder, on_delete=models.CASCADE)
    subtotal = models.DecimalField(
        default=0.0, decimal_places=2, max_digits=16, editable=False
    )
    total = models.DecimalField(
        default=0.0, decimal_places=2, max_digits=16, editable=False
    )
