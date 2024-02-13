from rest_framework import routers

from inventory.views import PriceLevelViewSet, ProductViewSet, ProductPriceViewSet

router = routers.DefaultRouter()
router.register(r'price_levels', PriceLevelViewSet)
router.register(r'product_prices', ProductPriceViewSet)
router.register(r'products', ProductViewSet)

urlpatterns = router.urls
urlpatterns += [
    
]
