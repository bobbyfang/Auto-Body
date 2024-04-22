from django.shortcuts import render

from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from sales.models import Quotation, Order, Invoice
from sales.serializers import (
    OrderListSerializer,
    QuotationSerializer,
    QuotationItemSerializer,
    QuotationListSerializer,
    OrderSerializer,
    OrderItemSerializer,
    InvoiceSerializer,
    InvoiceItemSerializer,
)


# Create your views here.
class QuotationsViewSet(viewsets.ModelViewSet):
    # permission_classes = [IsAuthenticated]
    queryset = Quotation.objects.all()
    serializer_class = QuotationSerializer


class QuotationReferenceNumbersViewSet(viewsets.ModelViewSet):
    # permission_classes = [IsAuthenticated]
    queryset = Quotation.objects.all()
    serializer_class = QuotationListSerializer


class OrdersViewSet(viewsets.ModelViewSet):
    # permission_classes = [IsAuthenticated]
    queryset = Order.objects.all()
    serializer_class = OrderSerializer


class OrderReferenceNumbersViewSet(viewsets.ModelViewSet):
    # permission_classes = [IsAuthenticated]
    queryset = Order.objects.all()
    serializer_class = OrderListSerializer


class InvoicesViewSet(viewsets.ModelViewSet):
    # permission_classes = [IsAuthenticated]
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer
