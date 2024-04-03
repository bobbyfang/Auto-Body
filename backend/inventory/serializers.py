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
    id = serializers.CharField()

    class Meta:
        model = ProductLocation
        fields = ["id", "location", "date", "inactive"]

    def create(self, validated_data, product):
        supplier_item = ProductLocation.objects.create(
            product=product, **validated_data
        )

        return supplier_item

    def update(self, instance, validated_data):
        instance.location = validated_data.get("location", instance.location)
        instance.inactive = validated_data.get("inactive", instance.inactive)
        instance.save()

        return instance


class ProductSupplierItemSerializer(serializers.ModelSerializer):
    id = serializers.CharField()

    class Meta:
        model = ProductSupplierItem
        fields = ["id", "supplier_number", "supplier"]

    def create(self, validated_data, product):
        supplier_item = ProductSupplierItem.objects.create(
            product=product, **validated_data
        )

        return supplier_item

    def update(self, instance, validated_data):
        instance.supplier = validated_data.get("supplier", instance.supplier)
        instance.supplier_number = validated_data.get(
            "supplier_number", instance.supplier_number
        )
        instance.save()

        return instance


class ProductSerializer(serializers.ModelSerializer):
    prices = ProductPriceSerializer(many=True)
    supplier_numbers = ProductSupplierItemSerializer(many=True)
    locations = ProductLocationSerializer(many=True)

    class Meta:
        model = Product
        fields = "__all__"

    def create(self, validated_data):
        prices = validated_data.pop("prices")
        supplier_numbers = validated_data.pop("supplier_numbers")
        locations = validated_data.pop("locations")

        product = Product.objects.create(**validated_data)

        product.prices.set(prices)
        product.supplier_numbers.set(supplier_numbers)
        product.locations.set(locations)

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

        supplier_numbers = validated_data.get("supplier_numbers")

        for supplier_number in supplier_numbers:
            id = supplier_number.get("id")
            try:
                id = int(id)
                product_supplier_item = ProductSupplierItem.objects.get(id=id)
                ProductSupplierItemSerializer().update(
                    product_supplier_item, supplier_number
                )
            except (TypeError, ValueError, ProductSupplierItem.DoesNotExist):
                supplier_number.pop("id")
                product_supplier_item = ProductSupplierItemSerializer().create(
                    supplier_number, product=instance
                )
                supplier_number["id"] = product_supplier_item.id

        supplier_numbers_ids = map(
            lambda supplier_number: supplier_number.get("id"), supplier_numbers
        )
        instance.supplier_numbers.exclude(id__in=supplier_numbers_ids).delete()

        locations = validated_data.get("locations")

        for location in locations:
            id = location.get("id")
            try:
                id = int(id)
                product_location = ProductLocation.objects.get(id=id)
                ProductLocationSerializer().update(product_location, location)
            except (TypeError, ValueError, ProductLocation.DoesNotExist):
                location.pop("id")
                product_location = ProductLocationSerializer().create(
                    location, product=instance
                )
                location["id"] = product_location.id

        location_ids = map(lambda location: location.get("id"), locations)
        instance.locations.exclude(id__in=location_ids).delete()

        instance.save()
        return instance
