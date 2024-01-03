from rest_framework import routers

from customers.views import CustomerViewSet, ContactPersonViewSet

router = routers.DefaultRouter()
router.register(r'customers', CustomerViewSet)
router.register(r'contact_persons', ContactPersonViewSet)

urlpatterns = router.urls
