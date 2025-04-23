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
        nombre = request.data.get('nombre')
        apellido = request.data.get('apellido')
        direccion = request.data.get('direccion')
        telefono = request.data.get('telefono')
        cedula = request.data.get('cedula')

        if not username:
            return Response({"error": "El campo 'username' es obligatorio."}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({'error': 'El usuario ya existe'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, password=password, email=email, rol=rol,
                                       nombre=nombre, apellido=apellido, direccion=direccion,
                                       telefono=telefono, cedula=cedula)
        user.save()

        return Response({'mensaje': 'Usuario creado correctamente'}, status=status.HTTP_201_CREATED)

# Vista personalizada para login con JWT + datos de usuario
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = User.USERNAME_FIELD

    def validate(self, attrs):
        identificador = attrs.get("username")  # puede ser username o email
        password = attrs.get("password")
        print(f"Intento de login con identificador: '{identificador}' y contraseña: '{password}'")

        try:
            user = User.objects.get(Q(username__iexact=identificador) | Q(email__iexact=identificador))
            print(f"Usuario encontrado (username: '{user.username}', email: '{user.email}', is_active: {user.is_active})")
        except User.DoesNotExist:
            print(f"Usuario con identificador '{identificador}' no encontrado")
            raise serializers.ValidationError(_("Usuario o contraseña incorrectos"))

        credentials = {
        "username": user.username,
        "password": password,
        }

        authenticated_user = authenticate(**credentials)
        print(f"Resultado de authenticate(): {authenticated_user}")

        if authenticated_user is None:
            print("Autenticación fallida")
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
                "nombre": user.nombre,
                "apellido": user.apellido,
                "direccion": user.direccion,
                "telefono": user.telefono,
                "cedula": user.cedula,
            }
        })

        return data

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

# VistaSet para manejar usuarios si se requiere en admin/CRUD/API
class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer