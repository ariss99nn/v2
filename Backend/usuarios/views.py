from django.shortcuts import render
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils.translation import gettext_lazy as _
from django.db.models import Q
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Usuario
from .serializers import UsuarioSerializer
from rest_framework import serializers


User = get_user_model()

# Vista para registrar usuarios
class RegistroUsuarioView(APIView):
    
    permission_classes = [AllowAny]
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')
        rol = request.data.get('rol', 'CLIENT')  # Por defecto, Cliente

        if not username:
            return Response({"error": "El campo 'username' es obligatorio."}, status=status.HTTP_400_BAD_REQUEST)
        
        if User.objects.filter(username=username).exists():
            return Response({'error': 'El usuario ya existe'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = User.objects.create_user(username=username, password=password, email=email, rol=rol)
        user.save()

        return Response({'mensaje': 'Usuario creado correctamente'}, status=status.HTTP_201_CREATED)

# Vista personalizada para login con JWT + datos de usuario
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = User.USERNAME_FIELD

    def validate(self, attrs):
        identificador = attrs.get("username")  # puede ser username o email
        password = attrs.get("password")

        try:
            user = User.objects.get(Q(username=identificador) | Q(email=identificador))
        except User.DoesNotExist:
            raise serializers.ValidationError(_("Usuario o contraseña incorrectos"))

        credentials = {
            "username": user.username,
            "password": password,
        }

        user = authenticate(**credentials)

        if user is None:
            raise serializers.ValidationError(_("Usuario o contraseña incorrectos"))

        data = super().validate({
            "username": user.username,
            "password": password
        })

        # Datos adicionales
        data.update({
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "rol": user.rol,
                "is_staff": user.is_staff,
            }
        })

        return data

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

# VistaSet para manejar usuarios si se requiere en admin/CRUD/API
class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer