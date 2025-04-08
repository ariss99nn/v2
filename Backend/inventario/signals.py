from django.db.models.signals import post_save
from django.dispatch import receiver
from productos.models import Producto
from inventario.models import Inventario

@receiver(post_save, sender=Producto)
def crear_inventario_automatico(sender, instance, created, **kwargs):
    """
    Cuando se crea un nuevo producto, su stock inicializa el inventario.
    """
    if created:  # Solo al crear un nuevo producto
        Inventario.objects.create(producto=instance, cantidad=instance.stock)
        print(f"Inventario creado para {instance.nombre} con {instance.stock} unidades.")
    else:
        # Si se actualiza el producto, el inventario también se actualiza
        inventario, _ = Inventario.objects.get_or_create(producto=instance)
        inventario.cantidad = instance.stock
        inventario.save()
        print(f"Inventario actualizado para {instance.nombre} a {instance.stock} unidades.")