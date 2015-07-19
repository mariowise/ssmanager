
from myapp.modulos.estado_1.models import Media, Comentario, StateOne, Etiqueta
from rest_framework import serializers, viewsets

from rest_framework.response import Response
from rest_framework.decorators import detail_route
from rest_framework import status
from google.appengine.ext import db

from myapp.modulos.api.v1.models.comments import CommentSerializer
from myapp.modulos.api.v1.models.tags import TagSerializer

# Serializers define the API representation.
class MediaSerializer(serializers.ModelSerializer):
    comments = serializers.SerializerMethodField()
    tags = serializers.SerializerMethodField()
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
            'tags_media',

            'comments',
            'tags'
        )
        read_only_fields = ('comments_media','tags_media',)

    def get_comments(self, obj):
        comments = obj.returnComments()
        return CommentSerializer(comments, many = True).data

    def get_tags(self, obj):
        tags = obj.returnTags()
        return TagSerializer(tags, many = True).data

# ViewSets define the view behavior.
class MediaViewSet(viewsets.ModelViewSet):
    queryset = Media.objects.all()
    serializer_class = MediaSerializer

    @db.transactional(xg=True)
    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)

            state = StateOne.objects.get(id = request.data["state_one_id"])
            if serializer.data["type_media"] == "1": state.ssp_videos.append(serializer.data["id"])
            if serializer.data["type_media"] == "2": state.ssp_imagenes.append(serializer.data["id"])
            if serializer.data["type_media"] == "3": state.ssp_audios.append(serializer.data["id"])
            if serializer.data["type_media"] == "4": state.ssp_documentos.append(serializer.data["id"])
            state.save()
            
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except StateOne.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    @detail_route(methods=['post'])
    @db.transactional(xg=True)
    def add_tag(self, request, *args, **kargs):
        try:
            media = self.get_object()
            tag = Etiqueta.objects.get(id=request.data['tag_id'])
            if tag.id not in media.tags_media: media.tags_media.append(tag.id)
            media.save()
            serializer = self.get_serializer(media)
            return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
        except Etiqueta.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    @detail_route(methods=['post'])
    @db.transactional(xg=True)
    def rm_tag(self, request, *args, **kargs):
        try:
            media = self.get_object()
            tag = Etiqueta.objects.get(id=request.data['tag_id'])
            if tag.id in media.tags_media: media.tags_media.remove(tag.id)
            media.save()
            serializer = self.get_serializer(media)
            return Response(serializer.data)
        except Etiqueta.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
