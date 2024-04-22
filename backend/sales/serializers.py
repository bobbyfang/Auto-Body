from django.contrib.auth.models import User

from rest_framework import serializers

from sales.models import (
    Quotation,
    QuotationItem,
    Order,
    OrderItem,
    Invoice,
    InvoiceItem,
)


def product_description(obj):
    return f"{obj.product.description} {obj.product.model} {obj.product.year}"


class QuotationItemSerializer(serializers.ModelSerializer):
    id = serializers.CharField()
    description = serializers.SerializerMethodField()
    price = serializers.DecimalField(max_digits=16, decimal_places=2)
    vat = serializers.DecimalField(max_digits=16, decimal_places=2)
    subtotal = serializers.DecimalField(max_digits=16, decimal_places=2)

    class Meta:
        model = QuotationItem
        # fields = "__all__"
        exclude = ["quotation"]

    def create(self, *args, **kwargs):
        quotation_item = QuotationItem.objects.create(*args, **kwargs)

        return quotation_item

    def get_description(self, obj):
        return product_description(obj)


class QuotationSerializer(serializers.ModelSerializer):
    items = QuotationItemSerializer(many=True)
    user = serializers.SlugRelatedField(
        slug_field="username", queryset=User.objects.all()
    )

    amount = serializers.DecimalField(max_digits=16, decimal_places=2)
    vat = serializers.DecimalField(max_digits=16, decimal_places=2)
    total = serializers.DecimalField(max_digits=16, decimal_places=2)

    class Meta:
        model = Quotation
        fields = "__all__"

    def create(self, validated_data):
        items = validated_data.pop("items")
        quotation = Quotation.objects.create(**validated_data)

        for item in items:
            try:
                item.pop("id")
            except KeyError:
                print("Quotation item does not have id field.")
            finally:
                QuotationItem.objects.create(quotation=quotation, **item)

        quotation.save()
        return quotation

    def update(self, instance, validated_data):
        instance.user = validated_data.get("user", instance.user)
        instance.customer = validated_data.get("customer", instance.customer)

        instance.amount = validated_data.get("amount", instance.amount)
        instance.vat = validated_data.get("vat", instance.vat)
        instance.total = validated_data.get("total", instance.total)

        instance.memo = validated_data.get("memo", instance.memo)

        items = validated_data.get("items")
        item_ids = map(lambda item: item.get("id"), items)
        item_ids = filter(lambda id: id.isnumeric(), item_ids)
        instance.items.exclude(id__in=item_ids).delete()

        for item in items:
            id = item.get("id")
            try:
                id = int(id)
                quotation_item_instance = QuotationItem.objects.get(id=id)
                QuotationItemSerializer().update(quotation_item_instance, item)
            except (TypeError, ValueError, QuotationItem.DoesNotExist):
                item.pop("id")
                QuotationItemSerializer().create(**item, quotation=instance)

        instance.save()
        return instance


class QuotationListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quotation
        fields = ["reference_number"]


class OrderItemSerializer(serializers.ModelSerializer):
    id = serializers.CharField()
    description = serializers.SerializerMethodField()
    price = serializers.DecimalField(max_digits=16, decimal_places=2)
    vat = serializers.DecimalField(max_digits=16, decimal_places=2)
    subtotal = serializers.DecimalField(max_digits=16, decimal_places=2)

    class Meta:
        model = OrderItem
        # fields = "__all__"
        exclude = ["order"]

    def create(self, *args, **kwargs):
        order_item = OrderItem.objects.create(*args, **kwargs)

        return order_item

    def get_description(self, obj):
        return product_description(obj)


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    user = serializers.SlugRelatedField(
        slug_field="username", queryset=User.objects.all()
    )

    amount = serializers.DecimalField(max_digits=16, decimal_places=2)
    vat = serializers.DecimalField(max_digits=16, decimal_places=2)
    total = serializers.DecimalField(max_digits=16, decimal_places=2)

    class Meta:
        model = Order
        fields = "__all__"

    def create(self, validated_data):
        items = validated_data.pop("items")

        order = Order.objects.create(**validated_data)

        for item in items:
            try:
                item.pop("id")
            except KeyError:
                print("Order item does not have id field.")
            finally:
                OrderItem.objects.create(order=order, **item)

        order.save()
        return order

    def update(self, instance, validated_data):
        instance.user = validated_data.get("user", instance.user)
        instance.customer = validated_data.get("customer", instance.customer)

        instance.amount = validated_data.get("amount", instance.amount)
        instance.vat = validated_data.get("vat", instance.vat)
        instance.total = validated_data.get("total", instance.total)

        instance.memo = validated_data.get("memo", instance.memo)

        items = validated_data.get("items")
        item_ids = map(lambda item: item.get("id"), items)
        item_ids = filter(lambda id: id.isnumeric(), item_ids)
        instance.items.exclude(id__in=item_ids).delete()

        for item in items:
            id = item.get("id")
            try:
                id = int(id)
                order_item_instance = OrderItem.objects.get(id=id)
                OrderItemSerializer().update(order_item_instance, item)
            except (TypeError, ValueError, OrderItem.DoesNotExist):
                item.pop("id")
                OrderItemSerializer().create(**item, order=instance)

        instance.save()
        return instance


class OrderListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ["reference_number"]


class InvoiceItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceItem
        fields = "__all__"


class InvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invoice
        fields = "__all__"
