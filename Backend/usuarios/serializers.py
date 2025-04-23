from rest_framework import serializers
from .models import Usuario

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'username', 'password', 'email', 'rol', 'nombre', 'apellido', 'direccion', 'telefono', 'cedula']
        extra_kwargs = {'password': {'write_only': True}} # Mantén la contraseña solo para escritura

