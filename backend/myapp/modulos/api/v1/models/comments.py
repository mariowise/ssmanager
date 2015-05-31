
from myapp.modulos.estado_1.models import Comentario
from rest_framework import serializers, viewsets

# Serializers define the API representation.
class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comentario
        fields = (
            'id',
        	'autor_comentary',
            'date_comentary',
            'content_comentary'
        )

# ViewSets define the view behavior.
class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comentario.objects.all()
    serializer_class = CommentSerializer