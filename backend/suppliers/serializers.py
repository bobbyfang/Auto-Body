from suppliers.models import Supplier, SupplierContactPerson

from rest_framework import serializers
from rest_framework_serializer_extensions.serializers import SerializerExtensionsMixin


class SupplierContactPersonSerializer(
    SerializerExtensionsMixin, serializers.ModelSerializer
):
    id = serializers.CharField()

    class Meta:
        model = SupplierContactPerson
        fields = ["id", "contact_name", "role", "phone_number", "email"]

    def create(self, validated_data, customer):
        contact_person = SupplierContactPerson.objects.create(
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


class SupplierSerializer(SerializerExtensionsMixin, serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = [
            "supplier_number",
            "name",
            "telephone_number",
            "fax_number",
            "mobile_number",
            "email",
            "physical_address",
            "billing_address",
            "memo",
            "contact_persons",
        ]
        expandable_fields = {
            "contact_persons": {
                "serializer": SupplierContactPersonSerializer,
                "many": True,
            }
        }

    def create(self, validated_data):
        contact_persons = validated_data.pop("contact_persons")

        supplier = Supplier.objects.create(**validated_data)

        supplier.contact_persons.set(
            map(
                lambda contact_person: SupplierContactPersonSerializer().create(
                    contact_person, supplier
                ),
                contact_persons,
            )
        )

        supplier.save()
        return supplier

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
        instance.vat_number = validated_data.get("vat_number", instance.vat_number)
        instance.company_key_number = validated_data.get(
            "company_key_number", instance.company_key_number
        )
        contact_persons = validated_data.pop("contact_persons")

        for contact_person in contact_persons:
            id = contact_person.get("id", None)
            try:
                id = int(id)
                contact_person_instance = SupplierContactPerson.objects.get(id=id)
                SupplierContactPersonSerializer().update(
                    contact_person_instance, contact_person
                )
            except (TypeError, ValueError, SupplierContactPerson.DoesNotExist):
                contact_person.pop("id")
                contact_person_instance = SupplierContactPersonSerializer().create(
                    contact_person, customer=instance
                )
                contact_person["id"] = contact_person_instance.id

        contact_persons_ids = map(
            lambda contact_person: contact_person.get("id"), contact_persons
        )
        instance.contact_persons.exclude(id__in=contact_persons_ids).delete()

        instance.save()
        return instance
