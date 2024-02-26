from inventory.models import (
    PriceLevel,
    Product,
    ProductLocation,
    ProductPrice,
    ProductSupplierItem,
)

from rest_framework import serializers


class PriceLevelSerializer(serializers.ModelSerializer):
    class Meta:
        model = PriceLevel
        fields = "__all__"


class ProductPriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductPrice
        fields = ["price", "level"]

    def update(self, instance, validated_data):
        instance.price = validated_data.get("price", instance.price)
        instance.save()
        return instance


class ProductLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductLocation
        fields = ["location", "date", "inactive"]


class ProductSupplierItemSerializer(serializers.ModelSerializer):
    # supplier = SupplierSerializer()

    class Meta:
        model = ProductSupplierItem
        fields = ["id", "supplier_number", "supplier"]


class ProductSerializer(serializers.ModelSerializer):
    prices = ProductPriceSerializer(many=True)
    supplier_numbers = ProductSupplierItemSerializer(many=True)
    locations = ProductLocationSerializer(many=True)

    class Meta:
        model = Product
        fields = "__all__"

    def create(self, validated_data):
        prices = validated_data.pop("prices")
        product = Product.objects.create(**validated_data)
        product.prices.set(prices)
        product.save()
        return product

    def update(self, instance, validated_data):
        instance.description = validated_data.get("description", instance.description)
        instance.oem_number = validated_data.get("oem_number", instance.oem_number)

        instance.make = validated_data.get("make", instance.make)
        instance.model = validated_data.get("model", instance.model)
        instance.year = validated_data.get("year", instance.year)
        instance.facelift = validated_data.get("facelift", instance.facelift)

        instance.units = validated_data.get("units", instance.units)

        instance.quantity = validated_data.get("quantity", instance.quantity)
        # print(validated_data.get("quantity"))
        instance.safety_quantity = validated_data.get(
            "safety_quantity", instance.safety_quantity
        )
        instance.in_transit = validated_data.get("in_transit", instance.in_transit)
        instance.eta = validated_data.get("eta", instance.eta)

        instance.fob_cost = validated_data.get("fob_cost", instance.fob_cost)
        instance.retail_price = validated_data.get(
            "retail_price", instance.retail_price
        )

        instance.manual_price = validated_data.get(
            "manual_price", instance.manual_price
        )
        instance.discountable = validated_data.get(
            "discountable", instance.discountable
        )
        instance.memo = validated_data.get("memo", instance.memo)
        instance.inactive = validated_data.get("inactive", instance.inactive)

        prices = validated_data.get("prices")
        for price in prices:
            level = price.get("level")
            product_price = ProductPrice.objects.get(product=instance, level=level)
            ProductPriceSerializer().update(product_price, price)

        instance.save()
        return instance
