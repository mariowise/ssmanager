
from myapp.modulos.estado_1.models import Media, Comentario
from rest_framework import serializers, viewsets

from rest_framework.response import Response
from rest_framework.decorators import detail_route
from rest_framework import status
from google.appengine.ext import db

# Serializers define the API representation.
class MediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Media
        fields = (
            'id',
        	'name_media',
            'description_media',
            'url_media',
            'uploaded_by',
            'date_media',
            'type_media',
            
            'comments_media',
            'tags_media'
        )

# ViewSets define the view behavior.
class MediaViewSet(viewsets.ModelViewSet):
    queryset = Media.objects.all()
    serializer_class = MediaSerializer

    # @detail_route(methods=['post'])
    # @db.transactional(xg=True) 
    # def add_comment(self, request, *args, **kargs):
    #     media = self.get_object()
    #     try:
    #         comment = Comentario.objects.get(id=request.POST.get('comment_id'))
    #         media.comments_media.append(comment.id)
    #         media.save()
    #         serializer = self.get_serializer(media)
    #         return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
    #     except Comentario.DoesNotExist:
    #         return Response(status=status.HTTP_404_NOT_FOUND)

    # @detail_route(methods=['post'])
    # @db.transactional(xg=True)
    # def add_tag(self, request, *args, **kargs):
    #     try:
    #         media = self.get_object()
    #         tag = Etiqueta.objects.get(id=request.POST.get('comment_id'))
    #         media.tags_media.append(tag.id)
    #         media.save()
    #         serializer = self.get_serializer(media)
    #         return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
    #     except Etiqueta.DoesNotExist:
    #         return Response(status=status.HTTP_404_NOT_FOUND)

    # @detail_route(methods=['post'])
    # @db.transactional(xg=True)
    # def rm_tag(self, request, *args, **kargs):
    #     try:
    #         media = self.get_object()
    #         tag = Etiqueta.objects.get(id=request.POST.get('comment_id'))
    #         del media.tags_media[media.tags_media.index(tag.id)]
    #         media.save()
    #         serializer = self.get_serializer(media)
    #         return Response(serializer.data)
    #     except Etiqueta.DoesNotExist:
    #         return Response(status=status.HTTP_404_NOT_FOUND)
