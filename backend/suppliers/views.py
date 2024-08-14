from django.shortcuts import render

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework_serializer_extensions.views import SerializerExtensionsAPIViewMixin

from suppliers.models import Supplier, SupplierContactPerson
from suppliers.serializers import SupplierSerializer, SupplierContactPersonSerializer
# Create your views here.


class SupplierViewSet(SerializerExtensionsAPIViewMixin, viewsets.ModelViewSet):
    # permission_classes = [IsAuthenticated]
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer


class SupplierContactPersonViewSet(
    SerializerExtensionsAPIViewMixin, viewsets.ModelViewSet
):
    # permission_classes = [IsAuthenticated]
    queryset = SupplierContactPerson.objects.all()
    serializer_class = SupplierContactPersonSerializer
