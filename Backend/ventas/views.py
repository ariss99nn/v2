from rest_framework import viewsets, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models import Sum, Count
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import Carrito, CarritoItem, Venta, DetalleVenta, CalificacionServicio
from .serializers import CarritoSerializer, CarritoItemSerializer, VentaSerializer, CalificacionServicioSerializer, DetalleVentaSerializer
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

    def get_queryset(self):
        # Obtiene el carrito del usuario actual
        carrito = get_object_or_404(Carrito, usuario=self.request.user)
        # Filtra los CarritoItem que pertenecen a ese carrito
        return CarritoItem.objects.filter(carrito=carrito)

    def create(self, request):
        carrito = get_object_or_404(Carrito, usuario=request.user)  # Obtener o crear el carrito aquí
        producto_id = request.data.get("producto")
        cantidad = int(request.data.get("cantidad", 1))

        item, created = CarritoItem.objects.get_or_create(carrito=carrito, producto_id=producto_id)
        if not created:
            item.cantidad += cantidad
            item.save()

        return Response(CarritoItemSerializer(item).data)
    
    def destroy(self, request, pk=None):
        try:
            item = get_object_or_404(CarritoItem, pk=pk, carrito__usuario=request.user)
            item.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except CarritoItem.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

class DetalleVentaViewSet(viewsets.ModelViewSet):
    queryset = DetalleVenta.objects.all()
    serializer_class = DetalleVentaSerializer
    permission_classes = [IsAuthenticated, IsAdminOrEmployee] # Ajusta los permisos según tus necesidades

    # Opcionalmente, puedes personalizar el comportamiento de los métodos create, update, etc.
    # Si la lógica por defecto de ModelViewSet es suficiente, no necesitas implementarlos.

    # Ejemplo de personalización del método create:
    # def create(self, request, *args, **kwargs):
    #     serializer = self.get_serializer(data=request.data)
    #     serializer.is_valid(raise_exception=True)
    #     self.perform_create(serializer)
    #     headers = self.get_success_headers(serializer.data)
    #     return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    # Ejemplo de cómo podrías filtrar los detalles de venta por un ID de venta específico:
    # @action(detail=False, methods=['get'])
    # def por_venta(self, request):
    #     venta_id = request.query_params.get('venta_id')
    #     if venta_id:
    #         detalles = DetalleVenta.objects.filter(venta_id=venta_id)
    #         serializer = self.get_serializer(detalles, many=True)
    #         return Response(serializer.data)
    #     else:
    #         return Response({"error": "Se debe proporcionar el ID de la venta."}, status=status.HTTP_400_BAD_REQUEST)

class FinalizarCompraView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = VentaCreateSerializer(data=request.data)
        if serializer.is_valid():
            metodo_pago = serializer.validated_data.get('metodo_pago')
            detalles_pago = serializer.validated_data.get('detalles_pago')

            # *** Lógica REAL del Carrito y Cálculo del Total ***
            # Aquí debes acceder a la información del carrito del usuario
            # (probablemente desde la sesión, base de datos o un estado en el frontend
            # que se envía en la petición).
            #
            # Simulación de datos del carrito:
            carrito_items = [
                {'producto_id': 1, 'cantidad': 2, 'precio_unitario': 20.00},
                {'producto_id': 3, 'cantidad': 1, 'precio_unitario': 55.75},
            ]

            total_venta = sum(item['cantidad'] * item['precio_unitario'] for item in carrito_items)

            venta = Venta.objects.create(
                usuario=request.user,
                total=total_venta,
                metodo_pago=metodo_pago,
                detalles_pago=detalles_pago
            )

            # Crear los detalles de la venta basados en los items del carrito
            for item in carrito_items:
                ItemVenta.objects.create(
                    venta=venta,
                    producto=item['producto_id'],
                    cantidad=item['cantidad'],
                    precio_unitario=item['precio_unitario']
                )

            venta_serializer = VentaSerializer(venta)
            return Response(venta_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
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
        detalle_ventas_data = []
        for item in carrito.carritoitem_set.all():
            detalle = DetalleVenta.objects.create(
                venta=venta,
                producto=item.producto,
                cantidad=item.cantidad,
                precio_unitario=item.producto.precio
            )
            # Crear una instancia del serializador para el objeto 'detalle'
            detalle_serializer = DetalleVentaSerializer(detalle)
            # Añadir los datos serializados a la lista
            detalle_ventas_data.append(detalle_serializer.data)
            # Actualizar stock del producto e inventario
            producto = item.producto
            producto.stock -= item.cantidad
            producto.save()
            if hasattr(Inventario, 'objects'):
                try:
                    inventario = Inventario.objects.get(producto=producto)
                    inventario.cantidad = producto.stock
                    inventario.save()
                except Inventario.DoesNotExist:
                    pass
        carrito.carritoitem_set.all().delete()
        venta_serializer = self.get_serializer(venta).data
        return Response({**venta_serializer, 'detalles': detalle_ventas_data}, status=status.HTTP_201_CREATED)

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