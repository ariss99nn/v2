from rest_framework import viewsets, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models import Sum, Count
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import Carrito, CarritoItem, Venta, DetalleVenta, CalificacionServicio
from .serializers import CarritoSerializer, CarritoItemSerializer, VentaSerializer, CalificacionServicioSerializer
from productos.views import IsAdminOrEmployee
from inventario.models import Inventario

class CarritoViewSet(viewsets.ModelViewSet):
    serializer_class = CarritoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Carrito.objects.filter(usuario=self.request.user)

    def create(self, request):
        carrito, created = Carrito.objects.get_or_create(usuario=request.user)
        return Response(CarritoSerializer(carrito).data)

class CarritoItemViewSet(viewsets.ModelViewSet):
    serializer_class = CarritoItemSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request):
        carrito, _ = Carrito.objects.get_or_create(usuario=request.user)
        producto_id = request.data.get("producto")
        cantidad = int(request.data.get("cantidad", 1))

        item, created = CarritoItem.objects.get_or_create(carrito=carrito, producto_id=producto_id)
        if not created:
            item.cantidad += cantidad
            item.save()

        return Response(CarritoItemSerializer(item).data)

class VentaViewSet(viewsets.ModelViewSet):
    queryset= Venta.objects.all()
    serializer_class = VentaSerializer
    permission_classes = [IsAuthenticated, IsAdminOrEmployee]
    
    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)
    def create(self, request):
        carrito = get_object_or_404(Carrito, usuario=request.user)
        if not carrito.carritoitem_set.exists():
            return Response({"error": "Carrito vacío"}, status=status.HTTP_400_BAD_REQUEST)
        total = sum(item.subtotal() for item in carrito.carritoitem_set.all())
        venta = Venta.objects.create(usuario=request.user, total=total)
        for item in carrito.carritoitem_set.all():
            DetalleVenta.objects.create(
                venta=venta,
                producto=item.producto,
                cantidad=item.cantidad,
                precio_unitario=item.producto.precio,
            )   
        # Actualizar stock del producto e inventario
            producto = item.producto
            producto.stock -= item.cantidad
            producto.save()
            inventario = Inventario.objects.get(producto=producto)
            inventario.cantidad = producto.stock
            inventario.save()
        carrito.carritoitem_set.all().delete()
        return Response(VentaSerializer(venta).data)
class CalificacionServicioViewSet(viewsets.ModelViewSet):
    queryset = CalificacionServicio.objects.all()
    serializer_class = CalificacionServicioSerializer
    permission_classes = [IsAuthenticated]
    # Puedes agregar lógica para que solo el usuario que realizó la venta pueda calificarla
    def perform_create(self, serializer):
        # Si deseas que la venta esté asociada al usuario actual, puedes validar aquí
        serializer.save()
# Reporte General de Ventas: Total de ventas e ingresos acumulados
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def reporte_ventas(request):
    total_ventas = Venta.objects.count()
    ingresos_totales = Venta.objects.aggregate(total=Sum('total'))['total'] or 0
    return Response({
        "total_ventas": total_ventas,
        "ingresos_totales": ingresos_totales
    })
# Reporte de Ventas por Usuario: Ventas agrupadas por usuario
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def reporte_ventas_usuario(request):
    # Agrupa por usuario y suma el total de ventas para cada uno
    ventas_por_usuario = Venta.objects.values('usuario__username').annotate(
        total_ventas=Sum('total'),
        cantidad_ventas=Count('id')
    ).order_by('-total_ventas')
    return Response(ventas_por_usuario)
# Reporte de Productos Más Vendidos: Lista de productos ordenados por cantidad vendida
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def reporte_productos_mas_vendidos(request):
    # Agrupa por producto y suma la cantidad vendida
    productos_vendidos = DetalleVenta.objects.values('producto__nombre').annotate(
        total_vendido=Sum('cantidad')
    ).order_by('-total_vendido')
    return Response(productos_vendidos)
