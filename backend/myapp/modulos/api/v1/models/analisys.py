
from myapp.modulos.estado_1.models import Analisis, Etiqueta
from rest_framework import serializers, viewsets

from rest_framework.response import Response
from rest_framework.decorators import detail_route
from rest_framework import status
from google.appengine.ext import db

from myapp.modulos.api.v1.models.documents import DocumentSerializer
from myapp.modulos.api.v1.models.comments import CommentSerializer
from myapp.modulos.api.v1.models.tags import TagSerializer

# Serializers define the API representation.
class AnalisysSerializer(serializers.ModelSerializer):
    documents = serializers.SerializerMethodField()
    comments = serializers.SerializerMethodField()
    tags = serializers.SerializerMethodField()

    class Meta:
        model = Analisis
        fields = (
            'id',
        	'name_analisis',
            'description_analisis',
            'links_analisis',
            'comments_analisis',
            'tags_analisis',
            'created_by',
            'date_analisis',

            'documents',
            'comments',
            'tags'
        )
        read_only_fields = ('links_analisis','comments_analisis', 'tags_analisis',)

    def get_documents(self, obj):
        return DocumentSerializer(obj.returnDocuments(), many=True).data

    def get_comments(self, obj):
        return CommentSerializer(obj.returnComments(), many=True).data

    def get_tags(self, obj):
        return TagSerializer(obj.returnTags(), many=True).data

# ViewSets define the view behavior.
class AnalisysViewSet(viewsets.ModelViewSet):
    queryset = Analisis.objects.all()
    serializer_class = AnalisysSerializer

    @detail_route(methods=['post'])
    @db.transactional(xg=True)
    def add_tag(self, request, *args, **kargs):
        try:
            anal = self.get_object()
            tag = Etiqueta.objects.get(id=request.data['tag_id'])
            if tag.id not in anal.tags_analisis: anal.tags_analisis.append(tag.id)
            anal.save()
            serializer = self.get_serializer(anal)
            return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
        except Etiqueta.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    @detail_route(methods=['post'])
    @db.transactional(xg=True)
    def rm_tag(self, request, *args, **kargs):
        try:
            anal = self.get_object()
            tag = Etiqueta.objects.get(id=request.data['tag_id'])
            if tag.id in anal.tags_analisis: anal.tags_analisis.remove(tag.id)
            anal.save()
            serializer = self.get_serializer(anal)
            return Response(serializer.data)
        except Etiqueta.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)