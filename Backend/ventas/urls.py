from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DetalleVentaSerializer, CarritoViewSet, CarritoItemViewSet, VentaViewSet,CalificacionServicioViewSet, reporte_ventas, reporte_ventas_usuario, reporte_productos_mas_vendidos


router = DefaultRouter()
router.register(r'carrito', CarritoViewSet, basename="carrito")
router.register(r'carrito-item', CarritoItemViewSet, basename="carrito-item")
router.register(r'venta', VentaViewSet, basename="venta")
#router.register(r'detalleventa', DetalleVentaSerializer, basename="detalleventa")
router.register(r'calificaciones', CalificacionServicioViewSet, basename= "calificaciones")  # Nueva ruta para calificaciones

urlpatterns = [
    path('', include(router.urls)),
    path('reporte/ventas/', reporte_ventas, name='reporte_ventas'),
    path('reporte/ventas-usuario/', reporte_ventas_usuario, name='reporte_ventas_usuario'),
    path('reporte/productos-mas-vendidos/', reporte_productos_mas_vendidos, name='reporte_productos_mas_vendidos'),
    
]