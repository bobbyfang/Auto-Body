from rest_framework import routers

from sales.views import (
    OrderReferenceNumbersViewSet,
    QuotationsViewSet,
    QuotationReferenceNumbersViewSet,
    OrdersViewSet,
    InvoicesViewSet,
)

router = routers.DefaultRouter()
router.register(r"quotations", QuotationsViewSet)
router.register(r"quotations_list", QuotationReferenceNumbersViewSet)
router.register(r"orders", OrdersViewSet)
router.register(r"orders_list", OrderReferenceNumbersViewSet)
router.register(r"invoices", InvoicesViewSet)

urlpatterns = router.urls
urlpatterns += []
