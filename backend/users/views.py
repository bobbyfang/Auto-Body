from django.contrib.auth.models import User

from rest_framework import viewsets
from rest_framework.exceptions import NotFound
from rest_framework.permissions import IsAuthenticated

from rest_framework_serializer_extensions.views import SerializerExtensionsAPIViewMixin

from users.serializers import UserSerializer


# Create your views here.
class UsersViewSet(SerializerExtensionsAPIViewMixin, viewsets.ModelViewSet):
    # permission_classes = [IsAuthenticated]
    lookup_field = "username"
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_object(self):
        queryset = self.get_queryset()
        queryset = self.filter_queryset(queryset)

        lookup_url_kwarg = self.lookup_url_kwarg or self.lookup_field
        lookup_value = self.kwargs[lookup_url_kwarg]

        if lookup_value.isnumeric():
            try:
                return queryset.get(pk=lookup_value)
            except User.DoesNotExist:
                pass

        try:
            return queryset.get(username=lookup_value)
        except User.DoesNotExist:
            pass

        raise NotFound()
