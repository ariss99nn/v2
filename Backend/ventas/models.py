from django.db import models
from usuarios.models import Usuario
from productos.models import Producto
class Venta(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    total = models.DecimalField(max_digits=10, decimal_places=3, default=0.00)
    fecha = models.DateTimeField(auto_now_add=True)
    metodo_pago = models.CharField(max_length=50, blank=True, null=True)
    detalles_pago = models.JSONField(blank=True, null=True)
    def __str__(self):
        return f"Venta {self.id} - {self.usuario.username} -Total: ${self.total}" 
class Carrito(models.Model):
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE)  # Relación 1:1 con el usuario
    productos = models.ManyToManyField(Producto, through="CarritoItem")  # Relación N:M con productos
    def __str__(self):
        return f"Carrito de {self.usuario.username}"
class CarritoItem(models.Model):
    carrito = models.ForeignKey(Carrito, on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField(default=1)
    def subtotal(self):
        return self.cantidad * self.producto.precio
    def __str__(self):
        return f"{self.cantidad} x {self.producto.nombre} en carrito"   
class DetalleVenta(models.Model):
    venta = models.ForeignKey(Venta, on_delete=models.CASCADE, related_name="items")
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    def subtotal(self):
        return self.cantidad * self.precio_unitario
    def __str__(self):
        return f"{self.cantidad} x {self.producto.nombre} en venta #{self.venta.id}"
       
# Modelo para la Calificación del Servicio
class CalificacionServicio(models.Model):
    venta = models.OneToOneField(Venta, on_delete=models.CASCADE, related_name="calificacion")
    calificacion = models.IntegerField()  # Valor del 1 al 5 (por ejemplo)
    comentario = models.TextField(blank=True, null=True)
    fecha = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Calificación para venta {self.venta.id}: {self.calificacion}"