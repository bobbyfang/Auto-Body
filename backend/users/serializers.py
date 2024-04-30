from django.contrib.auth.models import User

from rest_framework import serializers
from rest_framework_serializer_extensions.serializers import SerializerExtensionsMixin


class UserSerializer(SerializerExtensionsMixin, serializers.ModelSerializer):
    class Meta:
        model = User
        # fields = "__all__"
        exclude = ["password", "last_login"]
