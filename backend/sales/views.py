from django.shortcuts import render

from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from rest_framework import viewsets

from rest_framework_serializer_extensions.views import SerializerExtensionsAPIViewMixin

from sales.models import Quotation, Order, Invoice
from sales.serializers import (
    QuotationSerializer,
    QuotationItemSerializer,
    OrderSerializer,
    OrderItemSerializer,
    InvoiceSerializer,
    InvoiceItemSerializer,
)


# Create your views here.
class QuotationsViewSet(SerializerExtensionsAPIViewMixin, viewsets.ModelViewSet):
    # permission_classes = [IsAuthenticated]
    queryset = Quotation.objects.all()
    serializer_class = QuotationSerializer


class OrdersViewSet(SerializerExtensionsAPIViewMixin, viewsets.ModelViewSet):
    # permission_classes = [IsAuthenticated]
    queryset = Order.objects.all()
    serializer_class = OrderSerializer


class InvoicesViewSet(SerializerExtensionsAPIViewMixin, viewsets.ModelViewSet):
    # permission_classes = [IsAuthenticated]
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer
