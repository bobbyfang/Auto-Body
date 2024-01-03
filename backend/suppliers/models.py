from django.db import models

from phonenumber_field.phonenumber import PhoneNumber
from phonenumber_field.modelfields import PhoneNumberField

# Create your models here.


class Supplier(models.Model):
    supplier_number = models.CharField(primary_key=True, max_length=128)
    name = models.CharField(max_length=128)
    telephone_number = PhoneNumberField(default="")
    fax_number = PhoneNumberField(default="", blank=True)
    mobile_number = PhoneNumberField(default="", blank=True)
    email = models.EmailField(default="", blank=True)
    address = models.TextField(default="", blank=True)

    memo = models.TextField(default="", blank=True)

    class Meta:
        ordering = ['supplier_number']

    @classmethod
    def get_default_pk(cls):
        supplier, _ = cls.objects.get_or_create(supplier_number="001",
                                                defaults={"name": " ",
                                                          "telephone_number": PhoneNumber.from_string("+27000000000")})
        return supplier

    def __str__(self):
        return str(self.name)


class SupplierContactPerson(models.Model):
    contact_name = models.CharField(max_length=128)
    role = models.CharField(max_length=128, blank=True, default="")
    phone_number = PhoneNumberField()
    email = models.EmailField(blank=True, default="")
    supplier = models.ForeignKey(Supplier,
                                 on_delete=models.CASCADE,
                                 related_name="contact_persons",
                                 default=Supplier.get_default_pk)

    class Meta:
        verbose_name = "contact person"

    def __str__(self):
        return str(self.contact_name)
