from django.shortcuts import render

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from customers.models import Customer, ContactPerson
from customers.serializers import CustomerSerializer, ContactPersonSerializer
# Create your views here.


class CustomerViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer


class ContactPersonViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = ContactPerson.objects.all()
    serializer_class = ContactPersonSerializer
