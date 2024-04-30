from customers.models import Customer, ContactPerson

from rest_framework import serializers
from rest_framework_serializer_extensions.serializers import SerializerExtensionsMixin


class ContactPersonSerializer(SerializerExtensionsMixin, serializers.ModelSerializer):
    id = serializers.IntegerField()

    class Meta:
        model = ContactPerson
        fields = ["id", "contact_name", "role", "email", "customer"]


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
            contact_person_id = contact_person.get("id", None)
            if contact_person_id:
                contact_person_instance = ContactPerson.objects.get(
                    id=contact_person_id
                )
                if contact_person_instance:
                    contact_person_instance.contact_name = contact_person.get(
                        "contact_name", contact_person_instance.contact_name
                    )
                    contact_person_instance.role = contact_person.get(
                        "role", contact_person_instance.contact_name
                    )
                    contact_person_instance.phone_number = contact_person.get(
                        "phone_number", contact_person_instance.contact_name
                    )
                    contact_person_instance.email = contact_person.get(
                        "email", contact_person_instance.contact_name
                    )
                    contact_person_instance.customer = instance
            else:
                contact_person_instance = ContactPerson.objects.create(
                    defaults=contact_person
                )
            contact_person_instance.save()

        instance.save()
        return instance
