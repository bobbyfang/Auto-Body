from rest_framework import routers

from sales.views import (
    CreditNotesViewSet,
    QuotationsViewSet,
    OrdersViewSet,
    InvoicesViewSet,
)

router = routers.DefaultRouter()
router.register(r"quotations", QuotationsViewSet)
router.register(r"orders", OrdersViewSet)
router.register(r"invoices", InvoicesViewSet)
router.register(r"credit_notes", CreditNotesViewSet)

urlpatterns = router.urls
urlpatterns += []
