from rest_framework import routers

from suppliers.views import SupplierViewSet, SupplierContactPersonViewSet

router = routers.DefaultRouter()
router.register(r"suppliers", SupplierViewSet)
router.register(r"contact_persons", SupplierContactPersonViewSet)

urlpatterns = router.urls
