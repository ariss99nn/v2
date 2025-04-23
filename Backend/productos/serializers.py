from rest_framework import serializers
from .models import Categoria, Producto, Proveedor

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'

class ProductoSerializer(serializers.ModelSerializer):
    #categoria = serializers.StringRelatedField(read_only=True)  # Muestra el resultado de __str__ de Categoria

    categoria = serializers.PrimaryKeyRelatedField(queryset = Categoria.objects.all())

    class Meta:
        model = Producto
        fields = '__all__'

class ProveedorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proveedor
        fields = '__all__'
