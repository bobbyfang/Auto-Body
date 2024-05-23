from customers.models import Customer, ContactPerson

from rest_framework import serializers
from rest_framework_serializer_extensions.serializers import SerializerExtensionsMixin


class ContactPersonSerializer(SerializerExtensionsMixin, serializers.ModelSerializer):
    id = serializers.CharField()

    class Meta:
        model = ContactPerson
        fields = ["id", "contact_name", "role", "phone_number", "email"]

    def create(self, validated_data, customer):
        contact_person = ContactPerson.objects.create(
            customer=customer, **validated_data
        )

        return contact_person

    def update(self, instance, validated_data):
        instance.contact_name = validated_data.get(
            "contact_name", instance.contact_name
        )
        instance.role = validated_data.get("role", instance.role)
        instance.phone_number = validated_data.get(
            "phone_number", instance.phone_number
        )
        instance.email = validated_data("email", instance.email)
        instance.save()

        return instance


class CustomerSerializer(SerializerExtensionsMixin, serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = [
            "customer_number",
            "name",
            "telephone_number",
            "fax_number",
            "mobile_number",
            "email",
            "physical_address",
            "billing_address",
            "credit_limit",
            "customer_level",
            "vat_number",
            "company_key_number",
            "shipping_instructions",
            "suspend",
            "suspend_date",
        ]
        expandable_fields = {
            "contact_persons": {"serializer": ContactPersonSerializer, "many": True}
        }

    def create(self, validated_data):
        contact_persons = validated_data.pop("contact_persons")

        customer = Customer.objects.create(**validated_data)

        customer.contact_persons.set(
            map(
                lambda contact_person: ContactPersonSerializer().create(
                    contact_person, customer
                ),
                contact_persons,
            )
        )

        customer.save()
        return customer

    def update(self, instance, validated_data):
        instance.name = validated_data.get("name", instance.name)
        instance.telephone_number = validated_data.get(
            "telephone_number", instance.telephone_number
        )
        instance.fax_number = validated_data.get(
            "telephone_number", instance.fax_number
        )
        instance.mobile_number = validated_data.get(
            "mobile_number", instance.mobile_number
        )
        instance.email = validated_data.get("email", instance.email)
        instance.physical_address = validated_data.get(
            "physical_address", instance.physical_address
        )
        instance.billing_address = validated_data.get(
            "billing_address", instance.billing_address
        )
        instance.credit_limit = validated_data.get(
            "credit_limit", instance.credit_limit
        )
        instance.customer_level = validated_data.get(
            "customer_level", instance.customer_level
        )
        instance.vat_number = validated_data.get("vat_number", instance.vat_number)
        instance.company_key_number = validated_data.get(
            "company_key_number", instance.company_key_number
        )
        instance.shipping_instructions = validated_data.get(
            "shipping_instructions", instance.shipping_instructions
        )
        instance.suspend = validated_data.get("suspend", instance.suspend)
        instance.suspend_date = validated_data.get(
            "suspend_date", instance.suspend_date
        )
        contact_persons = validated_data.pop("contact_persons")

        for contact_person in contact_persons:
            id = contact_person.get("id", None)
            try:
                id = int(id)
                contact_person_instance = ContactPerson.objects.get(id=id)
                ContactPersonSerializer().update(
                    contact_person_instance, contact_person
                )
            except (TypeError, ValueError, ContactPerson.DoesNotExist):
                contact_person.pop("id")
                contact_person_instance = ContactPersonSerializer().create(
                    contact_person, customer=instance
                )
                contact_person["id"] = contact_person_instance.id

        contact_persons_ids = map(
            lambda contact_person: contact_person.get("id"), contact_persons
        )
        instance.contact_persons.exclude(id__in=contact_persons_ids).delete()

        instance.save()
        return instance
