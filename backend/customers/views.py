from django.shortcuts import render

from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from customers.models import Customer, ContactPerson
from customers.serializers import CustomerSerializer, ContactPersonSerializer
# Create your views here.


class CustomerViewSet(viewsets.ModelViewSet):
    # permission_classes = [IsAuthenticated]
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer


class ContactPersonViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = ContactPerson.objects.all()
    serializer_class = ContactPersonSerializer


@api_view(("POST",))
def update_customer(request):
    # return Response(status=status.HTTP_400_BAD_REQUEST)
    if request.method == "POST":
        customer_number = request.data.get("customer_number")
        customer = Customer.objects.get(pk=customer_number)
        serializer = CustomerSerializer(customer, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)
