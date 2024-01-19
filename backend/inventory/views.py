from django.shortcuts import render

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from inventory.models import PriceLevel
from inventory.serializers import PriceLevelSerializer


# Create your views here.
class PriceLevelViewSet(viewsets.ModelViewSet):
    # permission_classes = [IsAuthenticated]
    queryset = PriceLevel.objects.all()
    serializer_class = PriceLevelSerializer
