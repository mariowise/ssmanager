
from django.contrib.auth.models import User
from myapp.modulos.principal.models import userProfile

from myapp.modulos.comunicacion.models import Notificacion
from rest_framework import serializers, viewsets

# Serializers define the API representation.
class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notificacion
        fields = (
            'id',
            'creador_notificacion',
            'imagen_notificacion',
            'accion_notificacion',
            'url_notificacion',
            'date_notificacion',
            'users_noRead_notificacion',
            'id_asoc_notificacion',
            'type_notificacion'
        )
        read_only_fields = ('id_asoc_notificacion','users_noRead_notificacion',)

# ViewSets define the view behavior.
class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notificacion.objects.all()
    serializer_class = NotificationSerializer