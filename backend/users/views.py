from django.contrib.auth.models import User

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from users.serializers import UserSerializer


# Create your views here.
class UsersViewSet(viewsets.ModelViewSet):
    # permission_classes = [IsAuthenticated]
    lookup_field = "username"
    queryset = User.objects.all()
    serializer_class = UserSerializer
