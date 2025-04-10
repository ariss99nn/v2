from rest_framework import serializers 
from inventario.models import Inventario
from productos.models import Producto
from .models import Carrito, CarritoItem, Venta, DetalleVenta, CalificacionServicio

class CarritoItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarritoItem
        fields = '__all__'

class CarritoSerializer(serializers.ModelSerializer):
    items = CarritoItemSerializer(many=True, source="carritoitem_set", read_only=True)
    class Meta:
        model = Carrito
        fields = ['id', 'usuario', 'items']

class DetalleVentaSerializer(serializers.ModelSerializer):
    producto = serializers.PrimaryKeyRelatedField(queryset=Producto.objects.all())
    class Meta:
        model = DetalleVenta
        fields = '__all__'

class VentaSerializer(serializers.ModelSerializer):
    # Utilizamos "detalles" que se corresponde con "detalleventa_set"
    detalles = DetalleVentaSerializer(many=True, source="detalleventa_set", write_only=True)
    class Meta:
        model = Venta
        fields = ['id', 'usuario', 'fecha', 'total', 'detalles']
         
    def create(self, validated_data):
        # Extraemos los detalles usando la clave correcta
        detalles_data = validated_data.pop('detalleventa_set')
        venta = Venta.objects.create(**validated_data)
        total = 0

        for detalle_data in detalles_data:
            detalle_data["venta"] = venta
            producto = detalle_data["producto"]
            cantidad = detalle_data["cantidad"]
            subtotal = producto.precio * cantidad
            detalle_data["subtotal"] = subtotal
            total += subtotal
            # Crear el registro de DetalleVenta
            DetalleVenta.objects.create(**detalle_data)
            # Actualizar stock del producto
            producto.stock -= cantidad
            producto.save()
            # Si tienes un modelo Inventario y deseas actualizarlo:
            inventario = Inventario.objects.get(producto=producto)
            inventario.cantidad = producto.stock
            inventario.save()
        venta.total = total
        venta.save()
        return venta
    
class CalificacionServicioSerializer(serializers.ModelSerializer):
    class Meta:
        model = CalificacionServicio
        fields = ['id', 'venta', 'calificacion', 'comentario', 'fecha']
        read_only_fields = ['id', 'fecha']
