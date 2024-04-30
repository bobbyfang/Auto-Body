from django.db import models

from customers.models import Customer
from inventory.models import Product

from common.abstract.models import ReferenceModel
# Create your models here.


class Quotation(ReferenceModel):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)

    total = models.DecimalField(
        default=0.0, decimal_places=2, max_digits=16, editable=False
    )
    amount = models.DecimalField(
        default=0.0, decimal_places=2, max_digits=16, editable=False
    )
    vat = models.DecimalField(
        default=0.0, decimal_places=2, max_digits=16, editable=False
    )
    memo = models.TextField(default="", blank=True)

    def __str__(self):
        return str(self.reference_number)


class QuotationItem(models.Model):
    quotation = models.ForeignKey(
        Quotation, on_delete=models.CASCADE, related_name="items"
    )

    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    price = models.DecimalField(
        default=0.0, decimal_places=2, max_digits=16, editable=False
    )
    vat = models.DecimalField(
        default=0.0, decimal_places=2, max_digits=16, editable=False
    )
    subtotal = models.DecimalField(
        default=0.0, decimal_places=2, max_digits=16, editable=False
    )
    quantity = models.PositiveIntegerField(default=0)

    def __str__(self):
        return str(self.product.product_number)


class Order(ReferenceModel):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)

    total = models.DecimalField(
        default=0.0, decimal_places=2, max_digits=16, editable=False
    )
    amount = models.DecimalField(
        default=0.0, decimal_places=2, max_digits=16, editable=False
    )
    vat = models.DecimalField(
        default=0.0, decimal_places=2, max_digits=16, editable=False
    )
    memo = models.TextField(default="", blank=True)

    def __str__(self):
        return str(self.reference_number)


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")

    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    price = models.DecimalField(
        default=0.0, decimal_places=2, max_digits=16, editable=False
    )
    vat = models.DecimalField(
        default=0.0, decimal_places=2, max_digits=16, editable=False
    )
    subtotal = models.DecimalField(
        default=0.0, decimal_places=2, max_digits=16, editable=False
    )
    quantity = models.PositiveIntegerField(default=0)

    def __str__(self):
        return str(self.product.product_number)


class Invoice(ReferenceModel):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    invoice_number = models.IntegerField(editable=False, default=1, unique=True)

    total = models.DecimalField(
        default=0.0, decimal_places=2, max_digits=16, editable=False
    )
    amount = models.DecimalField(
        default=0.0, decimal_places=2, max_digits=16, editable=False
    )
    vat = models.DecimalField(
        default=0.0, decimal_places=2, max_digits=16, editable=False
    )
    memo = models.TextField(default="", blank=True)

    def __str__(self):
        return str(self.reference_number)

    def save(self, *args, **kwargs):
        if self._state.adding:
            last_id = Invoice.objects.all().aggregate(
                largest=models.Max("invoice_number")
            )["largest"]

            if last_id is not None:
                self.invoice_number = last_id + 1
            else:
                self.invoice_number = 1
        return super(Invoice, self).save(*args, **kwargs)


class InvoiceItem(models.Model):
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name="items")

    product = models.ForeignKey(Product, on_delete=models.PROTECT)

    price = models.DecimalField(
        default=0.0, decimal_places=2, max_digits=16, editable=False
    )
    vat = models.DecimalField(
        default=0.0, decimal_places=2, max_digits=16, editable=False
    )
    subtotal = models.DecimalField(
        default=0.0, decimal_places=2, max_digits=16, editable=False
    )
    quantity = models.PositiveIntegerField(default=0)

    def __str__(self):
        return str(self.product.product_number)
