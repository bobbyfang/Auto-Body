from inventory.models import PriceLevel

from rest_framework import serializers


class PriceLevelSerializer(serializers.ModelSerializer):
    class Meta:
        model = PriceLevel
        fields = '__all__'
