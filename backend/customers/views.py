from django.shortcuts import render

from rest_framework import viewsets

from customers.models import Customer, ContactPerson
from customers.serializers import CustomerSerializer, ContactPersonSerializer
# Create your views here.


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer


class ContactPersonViewSet(viewsets.ModelViewSet):
    queryset = ContactPerson.objects.all()
    serializer_class = ContactPersonSerializer
