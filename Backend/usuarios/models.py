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
    def __str__(self):
        return f"{self.username} - {self.rol}"
    
