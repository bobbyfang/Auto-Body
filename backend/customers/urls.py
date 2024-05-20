from django.urls import path

from rest_framework import routers

from customers.views import CustomerViewSet, ContactPersonViewSet
# , update_customer

router = routers.DefaultRouter()
router.register(r"customers", CustomerViewSet)
router.register(r"contact_persons", ContactPersonViewSet)

urlpatterns = router.urls
# urlpatterns += [
#     path("update_customer/", update_customer),
# ]
