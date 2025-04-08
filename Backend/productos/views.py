from rest_framework import viewsets
from .models import Categoria, Producto, Proveedor
from .serializers import CategoriaSerializer, ProductoSerializer, ProveedorSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated, BasePermission
#from django.contrib.auth.models import Permission
class IsAdminOrEmployee(BasePermission):
    def has_permission(self, request, view):
        if request.user.is_authenticated:
            return request.user.groups.filter(name__in=["ADMIN", "EMPLOYEE", "CLIENT"]).exists()
        return False  # No autenticado, sin acceso
    
class CategoriaViewSet(viewsets.ModelViewSet):
    serializer_class = CategoriaSerializer
    queryset = Categoria.objects.all()
    
class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer

    def get_permissions(self):
        # Permitir acceso público a list y retrieve
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        # Solo admin y empleados para crear, actualizar, eliminar
        return [IsAuthenticated(), IsAdminOrEmployee()]
    
class ProveedorViewSet(viewsets.ModelViewSet):
    queryset = Proveedor.objects.all()
    serializer_class = ProveedorSerializer

