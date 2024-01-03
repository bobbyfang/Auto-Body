from customers.models import Customer, ContactPerson

from rest_framework import serializers


class ContactPersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactPerson
        fields = '__all__'


class CustomerSerializer(serializers.ModelSerializer):
    contact_persons = ContactPersonSerializer(many=True)

    class Meta:
        model = Customer
        fields = ['customer_number',
                  "name",
                  "telephone_number",
                  "fax_number",
                  "mobile_number",
                  "email",
                  "physical_address",
                  "billing_address",
                  "credit_limit",
                  "customer_level",
                  "VAT Number",
                  "CK Number",
                  "shipping_instructions",
                  "suspend",
                  "suspend_date",
                  "contact_persons"]
