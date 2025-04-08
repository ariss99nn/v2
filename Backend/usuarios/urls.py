from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UsuarioViewSet
from .views import RegistroUsuarioView



router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet)

urlpatterns = [
    #path('', include(router.urls)),
    path('register/', RegistroUsuarioView.as_view(), name='register'),
]
