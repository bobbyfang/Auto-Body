from datetime import datetime

from django.db import models

from customers.models import Customer
from inventory.models import Product

from common.utils.formatting import convertDateToReferenceHeader, lastRefVariable
from common.abstract.models import ReferenceModel
# Create your models here.


class Quotation(ReferenceModel):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)

    total = models.DecimalField(default=0.0,
                                decimal_places=2,
                                max_digits=16,
                                editable=False)
    vat = models.DecimalField(default=0.0,
                              decimal_places=2,
                              max_digits=16,
                              editable=False)
    memo = models.TextField(default="", blank=True)

    def save(self, *args, **kwargs):
        if not self.reference_number:
            today = datetime.today()
            last_ref_number = lastRefVariable(Quotation)
            reference_header = convertDateToReferenceHeader(today)
            self.reference_number = f'{reference_header}{last_ref_number+1:03}'
        super(Quotation, self).save(*args, **kwargs)

    def __str__(self):
        return str(self.reference_number)


class QuotationItem(models.Model):
    quotation = models.ForeignKey(Quotation, on_delete=models.CASCADE)

    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    price = models.DecimalField(default=0.0,
                                decimal_places=2,
                                max_digits=16,
                                editable=False)
    vat = models.DecimalField(default=0.0,
                              decimal_places=2,
                              max_digits=16,
                              editable=False)
    subtotal = models.DecimalField(default=0.0,
                                   decimal_places=2,
                                   max_digits=16,
                                   editable=False)


class Order(ReferenceModel):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)

    total = models.DecimalField(default=0.0,
                                decimal_places=2,
                                max_digits=16,
                                editable=False)
    vat = models.DecimalField(default=0.0,
                              decimal_places=2,
                              max_digits=16,
                              editable=False)
    memo = models.TextField(default="", blank=True)

    def save(self, *args, **kwargs):
        if not self.reference_number:
            today = datetime.today()
            last_ref_number = lastRefVariable(Order)
            reference_header = convertDateToReferenceHeader(today)
            self.reference_number = f'{reference_header}{last_ref_number+1:03}'
        super(Order, self).save(*args, **kwargs)

    def __str__(self):
        return str(self.reference_number)


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)

    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    price = models.DecimalField(default=0.0,
                                decimal_places=2,
                                max_digits=16,
                                editable=False)
    vat = models.DecimalField(default=0.0,
                              decimal_places=2,
                              max_digits=16,
                              editable=False)
    subtotal = models.DecimalField(default=0.0,
                                   decimal_places=2,
                                   max_digits=16,
                                   editable=False)


class Invoice(ReferenceModel):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)

    total = models.DecimalField(default=0.0,
                                decimal_places=2,
                                max_digits=16,
                                editable=False)
    vat = models.DecimalField(default=0.0,
                              decimal_places=2,
                              max_digits=16,
                              editable=False)
    memo = models.TextField(default="", blank=True)

    def save(self, *args, **kwargs):
        if not self.reference_number:
            today = datetime.today()
            last_ref_number = lastRefVariable(Invoice)
            reference_header = convertDateToReferenceHeader(today)
            self.reference_number = f'{reference_header}{last_ref_number+1:03}'
        super(Invoice, self).save(*args, **kwargs)

    def __str__(self):
        return str(self.reference_number)


class InvoiceItem(models.Model):
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE)

    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    price = models.DecimalField(default=0.0,
                                decimal_places=2,
                                max_digits=16,
                                editable=False)
    vat = models.DecimalField(default=0.0,
                              decimal_places=2,
                              max_digits=16,
                              editable=False)
    subtotal = models.DecimalField(default=0.0,
                                   decimal_places=2,
                                   max_digits=16,
                                   editable=False)
