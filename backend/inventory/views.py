from django.shortcuts import render

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from inventory.models import PriceLevel, Product, ProductPrice
from inventory.serializers import (
    PriceLevelSerializer,
    ProductSerializer,
    ProductPriceSerializer,
)


# Create your views here.
class PriceLevelViewSet(viewsets.ModelViewSet):
    # permission_classes = [IsAuthenticated]
    queryset = PriceLevel.objects.all()
    serializer_class = PriceLevelSerializer


class ProductPriceViewSet(viewsets.ModelViewSet):
    # permission_classes = [IsAuthenticated]
    queryset = ProductPrice.objects.all()
    serializer_class = ProductPriceSerializer


class ProductViewSet(viewsets.ModelViewSet):
    # permission_classes = [IsAuthenticated]
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
