from rest_framework import serializers
from .models import Usuario
from django.core.validators import EmailValidator

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'username', 'password', 'email', 'rol', 'nombre', 'apellido', 'direccion', 'telefono', 'cedula']
        extra_kwargs = {'password': {'write_only': True}}

    def validate_email(self, value):
        """Valida el formato del email."""
        validator = EmailValidator()
        try:
            validator(value)
        except serializers.ValidationError:
            raise serializers.ValidationError("El email ingresado no tiene un formato válido.")
        return value

    def validate_username(self, value):
        """Valida la unicidad del username."""
        if Usuario.objects.filter(username=value).exists():
            raise serializers.ValidationError("Este nombre de usuario ya está en uso.")
        return value