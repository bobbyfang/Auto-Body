from rest_framework import routers

from customers import views

router = routers.DefaultRouter()
router.register(r'customers', views.CustomerViewSet)
router.register(r'contact_persons', views.ContactPersonViewSet)

urlpatterns = router.urls
