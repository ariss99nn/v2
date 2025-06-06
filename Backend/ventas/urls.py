from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CarritoViewSet, CarritoItemViewSet, VentaViewSet, CalificacionServicioViewSet, reporte_ventas, reporte_ventas_usuario, reporte_productos_mas_vendidos

router = DefaultRouter()
router.register(r'carrito', CarritoViewSet, basename="carrito")
router.register(r'carrito-item', CarritoItemViewSet, basename="carrito-item")
router.register(r'venta', VentaViewSet, basename="venta")
router.register(r'calificaciones', CalificacionServicioViewSet, basename="calificaciones")

urlpatterns = [
    path('', include(router.urls)),
    path('reportes/ventas/', reporte_ventas, name='reporte_ventas'),  # ✅ Cambiado a 'reportes/ventas/'
    path('reportes/ventas-usuario/', reporte_ventas_usuario, name='reporte_ventas_usuario'),  # ✅ Cambiado a 'reportes/ventas-usuario/'
    path('reportes/productos-mas-vendidos/', reporte_productos_mas_vendidos, name='reporte_productos_mas_vendidos'),  # ✅ Cambiado a 'reportes/productos-mas-vendidos/'
]