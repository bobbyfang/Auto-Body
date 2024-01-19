from rest_framework import routers

from inventory.views import PriceLevelViewSet

router = routers.DefaultRouter()
router.register(r'price_levels', PriceLevelViewSet)

urlpatterns = router.urls
urlpatterns += [
    
]
