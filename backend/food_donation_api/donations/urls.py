from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import FoodDonationViewSet

router = DefaultRouter()
router.register(r'donations', FoodDonationViewSet, basename='food-donation')

urlpatterns = [
    path('', include(router.urls)),
]
