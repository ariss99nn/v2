
from django.db.models.signals import post_migrate, post_save
from django.contrib.auth.models import Group, Permission
from django.dispatch import receiver
from .models import Usuario

@receiver(post_migrate)
def crear_roles(sender, **kwargs):
#Crea los grupos de usuario (roles) y asigna los permisos correspondientes después de aplicar las migraciones.
    roles = ['ADMIN', 'EMPLOYEE', 'CLIENT']  # Usamos los mismos valores que en el modelo de Usuario
    for role in roles:
        group, created = Group.objects.get_or_create(name=role)  # Crea el grupo si no existe
        # Asignar permisos específicos
        if role == 'EMPLOYEE':
            permisos = Permission.objects.filter(content_type__app_label='ventas')  # Ajusta 'ventas' al nombre real de tu app
            group.permissions.set(permisos)  # Asigna permisos al grupo
        elif role == 'CLIENT':
            group.permissions.clear()  # Cliente no tiene permisos administrativos
    print("Roles creados o actualizados correctamente.")

@receiver(post_save, sender=Usuario)
def asignar_grupo_usuario(sender, instance, created, **kwargs):
#Asigna automáticamente un usuario al grupo correspondiente según su rol al momento de crearse.
    if created:  # Solo al crear un nuevo usuario
        try:
            grupo = Group.objects.get(name=instance.rol)  # Obtiene el grupo según el rol del usuario
            instance.groups.add(grupo)  # Asigna el grupo al usuario
        except Group.DoesNotExist:
            print(f"El grupo {instance.rol} no existe. Asegúrate de que los grupos fueron creados correctamente.")