from django.db import models
# from django.contrib.auth.models import User

from inventory.models import PriceLevel

from phonenumber_field.modelfields import PhoneNumberField

# Create your models here.


class Customer(models.Model):
    customer_number = models.CharField(primary_key=True, max_length=128)
    name = models.CharField(max_length=128)
    telephone_number = PhoneNumberField(default="")
    fax_number = PhoneNumberField(default="", blank=True)
    mobile_number = PhoneNumberField(default="", blank=True)
    email = models.EmailField(default="", blank=True)
    physical_address = models.TextField(default="", blank=True)
    billing_address = models.TextField(default="", blank=True)

    credit_limit = models.DecimalField(max_digits=16,
                                       default=1000.00,
                                       decimal_places=2)
    customer_level = models.ForeignKey(PriceLevel,
                                       on_delete=models.PROTECT,
                                       default=PriceLevel.get_default_pk)

    vat_number = models.CharField(max_length=10,
                                  default="",
                                  name="VAT Number",
                                  blank=True)
    company_key_number = models.CharField(max_length=32,
                                          default="",
                                          name="CK Number",
                                          blank=True)

    shipping_instructions = models.TextField(default="", blank=True)
    memo = models.TextField(default="", blank=True)

    suspend = models.BooleanField(default=False)
    suspend_date = models.DateField(default=None, null=True, blank=True)

    def __str__(self):
        return str(self.name)


class ContactPerson(models.Model):
    contact_name = models.CharField(max_length=128)
    role = models.CharField(max_length=128, blank=True, default="")
    phone_number = PhoneNumberField()
    email = models.EmailField(blank=True, default="")
    customer = models.ForeignKey(Customer,
                                 on_delete=models.CASCADE,
                                 related_name='contact_persons')

    def __str__(self):
        return str(self.contact_name)
