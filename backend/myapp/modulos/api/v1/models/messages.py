
from myapp.modulos.comunicacion.models import Mensaje
from myapp.modulos.principal.models import userProfile
from rest_framework import serializers, viewsets

from rest_framework.response import Response
from rest_framework.decorators import detail_route, list_route
from rest_framework import status
from google.appengine.ext import db

from myapp.modulos.api.v1.models.users import UserSerializer

# Serializers define the API representation.
class MessageSerializer(serializers.ModelSerializer):
    receptores = serializers.SerializerMethodField()
    remitente = serializers.SerializerMethodField()
    
    class Meta:
        model = Mensaje
        fields = (
            'id',
            'remitente_mensaje',
            'receptores_mensaje',
            'asunto_mensaje',
            'contenido_mensaje',
            'date_mensaje',
            'proyecto_mensaje',
            'url_asoc_mensaje',

            'receptores',
            'remitente'
        )

    def get_receptores(self, obj):
        receptores = obj.returnReceptores()
        return UserSerializer(receptores, many=True).data

    def get_remitente(self, obj):
        remitente = obj.returnRemitente()
        return UserSerializer(remitente).data

# ViewSets define the view behavior.
class MessageViewSet(viewsets.ModelViewSet):
    queryset = Mensaje.objects.all()
    filter_fields = ('remitente_mensaje', 'date_mensaje',)
    serializer_class = MessageSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)

        # Que desagradable trabajar así...
        message = Mensaje.objects.get(id = serializer.data.get("id"))
        profiles = []
        for user in message.returnReceptores():
            profiles.append(userProfile.objects.get(user=user))
            
        for profile in profiles:
            profile.add_message_nl(profile.id, message.id)

        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def list(self, request, *args, **kwargs):
        profile = userProfile.objects.get(user = request.user)
        messages = profile.returnMensajesLeidos() + profile.returnMensajesNoLeidos()
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data, status=200)

    def destroy(self, request, *args, **kwargs):
        message = self.get_object()
        profile = userProfile.objects.get(user = request.user)
        userProfile.rm_message(profile.id, message.id)
        message.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @detail_route(methods=['post'])
    def mark_message(self, request, *args, **kwargs):
        message = self.get_object()
        profile = userProfile.objects.get(user = request.user)
        userProfile.mark_message(profile.id, message.id)
        return Response(status=200)

    @list_route(methods=['get'])
    def count(self, request, *args, **kwargs):
        try:
            profile = userProfile.objects.get(user = request.user)
            count = len(profile.returnMensajesNoLeidos())
            return Response(count, status=200)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)
