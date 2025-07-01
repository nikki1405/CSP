from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import FoodDonationViewSet
from . import views

router = DefaultRouter()
router.register(r'donations', FoodDonationViewSet, basename='food-donation')

urlpatterns = [
    path('', include(router.urls)),
    path('create-order/', views.create_order, name='create_order'),
    path('capture-order/<str:order_id>/', views.capture_order, name='capture_order'),
]
