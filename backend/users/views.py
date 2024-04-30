from django.contrib.auth.models import User

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from rest_framework_serializer_extensions.views import SerializerExtensionsAPIViewMixin

from users.serializers import UserSerializer


# Create your views here.
class UsersViewSet(SerializerExtensionsAPIViewMixin, viewsets.ModelViewSet):
    # permission_classes = [IsAuthenticated]
    lookup_field = "username"
    queryset = User.objects.all()
    serializer_class = UserSerializer
