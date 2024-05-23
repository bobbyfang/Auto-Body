from django.shortcuts import render

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from rest_framework import viewsets

from rest_framework_serializer_extensions.views import SerializerExtensionsAPIViewMixin

from customers.models import Customer, ContactPerson
from customers.serializers import CustomerSerializer, ContactPersonSerializer
# Create your views here.


class CustomerViewSet(SerializerExtensionsAPIViewMixin, viewsets.ModelViewSet):
    # permission_classes = [IsAuthenticated]
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer


class ContactPersonViewSet(SerializerExtensionsAPIViewMixin, viewsets.ModelViewSet):
    # permission_classes = [IsAuthenticated]
    queryset = ContactPerson.objects.all()
    serializer_class = ContactPersonSerializer
