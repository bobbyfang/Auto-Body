from django.shortcuts import render

from rest_framework.decorators import action
from rest_framework.exceptions import NotFound
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from rest_framework import viewsets

from rest_framework_serializer_extensions.views import SerializerExtensionsAPIViewMixin

from sales.models import CreditNote, Quotation, Order, Invoice
from sales.serializers import (
    CreditNoteSerializer,
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

    def get_object(self):
        queryset = self.get_queryset()
        queryset = self.filter_queryset(queryset)

        lookup_url_kwarg = self.lookup_url_kwarg or self.lookup_field
        lookup_value = self.kwargs[lookup_url_kwarg]

        try:
            return queryset.get(pk=lookup_value)
        except Invoice.DoesNotExist:
            pass

        if lookup_value.isnumeric():
            try:
                return queryset.get(invoice_number=lookup_value)
            except Invoice.DoesNotExist:
                pass

        raise NotFound()


class CreditNotesViewSet(SerializerExtensionsAPIViewMixin, viewsets.ModelViewSet):
    # permission_classes = [IsAuthenticated]
    queryset = CreditNote.objects.all()
    serializer_class = CreditNoteSerializer
