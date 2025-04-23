from django.contrib.auth.models import AbstractUser
from django.db import models
class Usuario(AbstractUser):
    ADMIN = 'ADMIN'
    EMPLOYEE = 'EMPLOYEE'
    CLIENT = 'CLIENT'
    ROLES = (
        (ADMIN, 'Administrador'),
        (EMPLOYEE, 'Empleado'),
        (CLIENT, 'Cliente'),
    )
    rol = models.CharField(max_length=10, choices=ROLES, default='CLIENT')
    nombre = models.CharField(max_length=100, blank=True, null=True)
    apellido = models.CharField(max_length=100, blank=True, null=True)
    direccion = models.CharField(max_length=255, blank=True, null=True)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    cedula = models.CharField(max_length=20, unique=True, blank=True, null=True)

    def __str__(self):
        return f"{self.username} - {self.rol}"