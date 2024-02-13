from suppliers.models import Supplier, SupplierContactPerson

from rest_framework import serializers


class SupplierContactPersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupplierContactPerson
        fields = "__all__"


class SupplierSerializer(serializers.ModelSerializer):
    contact_persons = SupplierContactPersonSerializer(many=True)

    class Meta:
        model = Supplier
        fields = [
            "supplier_number",
            "name",
            "telephone_number",
            "fax_number",
            "mobile_number",
            "email",
            "address",
            "memo",
            "contact_persons",
        ]
