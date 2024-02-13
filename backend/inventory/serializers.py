from inventory.models import PriceLevel, Product, ProductPrice

from rest_framework import serializers


class PriceLevelSerializer(serializers.ModelSerializer):
    class Meta:
        model = PriceLevel
        fields = '__all__'


class ProductPriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductPrice
        fields = '__all__'


class ProductSerializer(serializers.ModelSerializer):
    prices = ProductPriceSerializer(many=True)

    class Meta:
        model = Product
        fields = '__all__'


class ProductHyperlinkedSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Product
