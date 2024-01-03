from django.shortcuts import render

from rest_framework import viewsets

from suppliers.models import Supplier, SupplierContactPerson
from suppliers.serializers import SupplierSerializer, SupplierContactPersonSerializer
# Create your views here.


class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer


class SupplierContactPersonViewSet(viewsets.ModelViewSet):
    queryset = SupplierContactPerson.objects.all()
    serializer_class = SupplierContactPersonSerializer
