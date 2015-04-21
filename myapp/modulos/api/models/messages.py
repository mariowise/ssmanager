
from myapp.modulos.comunicacion.models import Mensaje
from rest_framework import serializers, viewsets

# Serializers define the API representation.
class MessageSerializer(serializers.HyperlinkedModelSerializer):
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
            'url_asoc_mensaje'
        )

# ViewSets define the view behavior.
class MessageViewSet(viewsets.ModelViewSet):
    queryset = Mensaje.objects.all()
    serializer_class = MessageSerializer