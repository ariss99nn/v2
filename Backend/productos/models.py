from django.db import models

class Categoria(models.Model):
    nombre = models.CharField(max_length=255)#unique=True)
    def __str__(self):
        return self.nombre
class Producto(models.Model):
    nombre = models.CharField(max_length=255)
    descripcion = models.TextField()
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE)
    stock = models.PositiveIntegerField(default=0)
    def __str__(self):
        return self.nombre   
class Proveedor(models.Model):
    nombre = models.CharField(max_length=255)
    contacto = models.CharField(max_length=100)
    telefono = models.CharField(max_length=15)
    def __str__(self):
        return self.nombre