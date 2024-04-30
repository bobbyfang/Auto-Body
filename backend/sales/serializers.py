from rest_framework import serializers
from rest_framework_serializer_extensions.serializers import SerializerExtensionsMixin

from customers.serializers import CustomerSerializer
from users.serializers import UserSerializer
from sales.models import (
    Quotation,
    QuotationItem,
    Order,
    OrderItem,
    Invoice,
    InvoiceItem,
)
from inventory.models import Product


def product_description(obj):
    return f"{obj.product.description} {obj.product.model} {obj.product.year}"


class QuotationItemSerializer(SerializerExtensionsMixin, serializers.ModelSerializer):
    class Meta:
        model = QuotationItem
        exclude = ["quotation"]

    id = serializers.CharField()
    description = serializers.SerializerMethodField()
    price = serializers.DecimalField(max_digits=16, decimal_places=2)
    vat = serializers.DecimalField(max_digits=16, decimal_places=2)
    subtotal = serializers.DecimalField(max_digits=16, decimal_places=2)

    def create(self, *args, **kwargs):
        quotation_item = QuotationItem.objects.create(*args, **kwargs)

        return quotation_item

    def get_description(self, obj):
        return product_description(obj)


class QuotationSerializer(SerializerExtensionsMixin, serializers.ModelSerializer):
    class Meta:
        model = Quotation
        fields = "__all__"
        expandable_fields = {
            "items": {"serializer": QuotationItemSerializer, "many": True},
            "user": {
                "serializer": UserSerializer,
                "id_source": False,
            },
            "customer": {"serializer": CustomerSerializer, "id_source": False},
        }

    # user = serializers.SlugRelatedField(
    #     slug_field="username", queryset=User.objects.all()
    # )

    amount = serializers.DecimalField(max_digits=16, decimal_places=2)
    vat = serializers.DecimalField(max_digits=16, decimal_places=2)
    total = serializers.DecimalField(max_digits=16, decimal_places=2)

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
        if items:
            item_ids = map(lambda item: item.get("id"), items)
            item_ids = filter(lambda id: id.isnumeric(), item_ids)
            instance.items.exclude(id__in=item_ids).delete()
            for item in items:
                item_id = item.get("id")
                try:
                    item_id = int(item_id)
                    quotation_item_instance = QuotationItem.objects.get(id=item_id)
                    QuotationItemSerializer().update(quotation_item_instance, item)
                except (TypeError, ValueError, QuotationItem.DoesNotExist):
                    item.pop("id")
                    QuotationItemSerializer().create(**item, quotation=instance)

        instance.save()
        return instance


class OrderItemSerializer(SerializerExtensionsMixin, serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        exclude = ["order"]

    id = serializers.CharField()
    description = serializers.SerializerMethodField()
    price = serializers.DecimalField(max_digits=16, decimal_places=2)
    vat = serializers.DecimalField(max_digits=16, decimal_places=2)
    subtotal = serializers.DecimalField(max_digits=16, decimal_places=2)

    def create(self, *args, **kwargs):
        order_item = OrderItem.objects.create(*args, **kwargs)

        return order_item

    def get_description(self, obj):
        return product_description(obj)


class OrderSerializer(SerializerExtensionsMixin, serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = "__all__"
        expandable_fields = {
            "items": {"serializer": OrderItemSerializer, "many": True},
            "user": {
                "serializer": UserSerializer,
                "id_source": False,
            },
            "customer": {"serializer": CustomerSerializer, "id_source": False},
        }

    amount = serializers.DecimalField(max_digits=16, decimal_places=2)
    vat = serializers.DecimalField(max_digits=16, decimal_places=2)
    total = serializers.DecimalField(max_digits=16, decimal_places=2)

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
        if items:
            item_ids = map(lambda item: item.get("id"), items)
            item_ids = filter(lambda id: id.isnumeric(), item_ids)
            instance.items.exclude(id__in=item_ids).delete()

            for item in items:
                item_id = item.get("id")
                try:
                    item_id = int(item_id)
                    order_item_instance = OrderItem.objects.get(id=item_id)
                    OrderItemSerializer().update(order_item_instance, item)
                except (TypeError, ValueError, OrderItem.DoesNotExist):
                    item.pop("id")
                    OrderItemSerializer().create(**item, order=instance)

        instance.save()
        return instance


class InvoiceItemSerializer(SerializerExtensionsMixin, serializers.ModelSerializer):
    class Meta:
        model = InvoiceItem
        exclude = ["invoice"]

    id = serializers.CharField()
    description = serializers.SerializerMethodField()
    price = serializers.DecimalField(max_digits=16, decimal_places=2)
    vat = serializers.DecimalField(max_digits=16, decimal_places=2)
    subtotal = serializers.DecimalField(max_digits=16, decimal_places=2)

    def create(self, *args, **kwargs):
        invoice_item = InvoiceItem.objects.create(*args, **kwargs)

        return invoice_item

    def get_description(self, obj):
        return product_description(obj)


class InvoiceSerializer(SerializerExtensionsMixin, serializers.ModelSerializer):
    class Meta:
        model = Invoice
        fields = "__all__"
        expandable_fields = {
            "items": {"serializer": InvoiceItemSerializer, "many": True},
            "user": {
                "serializer": UserSerializer,
                "id_source": False,
            },
            "customer": {"serializer": CustomerSerializer, "id_source": False},
        }

    amount = serializers.DecimalField(max_digits=16, decimal_places=2)
    vat = serializers.DecimalField(max_digits=16, decimal_places=2)
    total = serializers.DecimalField(max_digits=16, decimal_places=2)

    def create(self, validated_data):
        items = validated_data.pop("items")

        invoice = Invoice.objects.create(**validated_data)

        for item in items:
            try:
                item.pop("id")
            except KeyError:
                print("Invoice item does not have id field.")
            finally:
                InvoiceItem.objects.create(invoice=invoice, **item)

        invoice.save()
        return invoice

    def update(self, instance, validated_data):
        instance.user = validated_data.get("user", instance.user)
        instance.customer = validated_data.get("customer", instance.customer)

        instance.amount = validated_data.get("amount", instance.amount)
        instance.vat = validated_data.get("vat", instance.vat)
        instance.total = validated_data.get("total", instance.total)

        instance.memo = validated_data.get("memo", instance.memo)

        items = validated_data.get("items")

        item_ids = map(lambda item: item.get("id"), items)
        item_ids = list(filter(lambda id: id.isnumeric(), item_ids))
        removed_rows = instance.items.exclude(id__in=item_ids)
        for removed_row in removed_rows:
            product_instance = Product.objects.get(product_number=removed_row.product)
            product_instance.quantity += removed_row.quantity
            product_instance.save()
        removed_rows.delete()

        for item in items:
            item_id = item.get("id")
            try:
                item_id = int(item_id)
                invoice_item_instance = InvoiceItem.objects.get(id=item_id)
                old_quantity = invoice_item_instance.quantity

                InvoiceItemSerializer().update(invoice_item_instance, item)

                product_number = item.pop("product")
                new_quantity = item.pop("quantity")
                quantity_difference = new_quantity - old_quantity

                product_instance = Product.objects.get(product_number=product_number)
                product_instance.quantity -= quantity_difference
                product_instance.save()

            except (TypeError, ValueError, OrderItem.DoesNotExist):
                item.pop("id")
                InvoiceItemSerializer().create(**item, invoice=instance)

                product_number = item.pop("product")
                new_quantity = item.pop("quantity")

                product_instance = Product.objects.get(product_number=product_number)
                product_instance.quantity -= new_quantity
                product_instance.save()

        instance.save()
        return instance
