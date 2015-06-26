
from myapp.modulos.estado_1.models import Comentario, Media
from rest_framework import serializers, viewsets

from rest_framework.response import Response
from rest_framework.decorators import detail_route
from rest_framework import status
from google.appengine.ext import db

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

    @db.transactional(xg=True)
    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)

            media = Media.objects.get(id=request.data["media_id"])
            media.comments_media.append(serializer.data["id"])
            media.save()
            
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except Media.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
