from django.urls import path, include
from rest_framework import routers
from .views import CategoriaViewSet, ProductoViewSet, ProveedorViewSet

router = routers.DefaultRouter()
router.register(r'categorias', CategoriaViewSet)
router.register(r'productos', ProductoViewSet)
router.register(r'proveedores', ProveedorViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
