from rest_framework import viewsets
from ..models import Mesera
from ..serializers import MeseraSerializer
from ..authentication import GlobalAuthentication, IsSuperUser
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from ..services.auth_service import AuthService

class MeseraViewSet(viewsets.ModelViewSet):
    queryset = Mesera.objects.all().order_by('-id')
    serializer_class = MeseraSerializer
    authentication_classes = [GlobalAuthentication]
    
    # La validación de código único se ha movido al MeseraSerializer.
    # El método perform_create ya no es necesario aquí para esa validación.
    
    @action(detail=True, methods=['post'], url_path='cambiar-codigo')
    def cambiar_codigo(self, request, pk=None):
        """
        Permite al administrador cambiar el PIN de una mesera.
        Solo accesible por superusuarios.
        """
        if not (request.user.is_superuser or request.user.is_staff):
            return Response({'detail': 'No tienes permiso para esta acción.'}, status=status.HTTP_403_FORBIDDEN)
            
        mesera = self.get_object()
        nuevo_codigo = request.data.get('codigo')

        if not nuevo_codigo:
            return Response({'detail': 'El código es requerido.'}, status=status.HTTP_400_BAD_REQUEST)

        # Limpiar y asegurar que sea string de al menos 4 caracteres
        nuevo_codigo_str = str(nuevo_codigo).strip()

        if len(nuevo_codigo_str) < 4:
            return Response({'detail': 'El código debe tener al menos 4 caracteres.'}, status=status.HTTP_400_BAD_REQUEST)

        # Hash the password using service
        AuthService.change_mesera_code(mesera, nuevo_codigo_str)

        return Response({'detail': f'Código de {mesera.nombre} actualizado y encriptado correctamente.'})
