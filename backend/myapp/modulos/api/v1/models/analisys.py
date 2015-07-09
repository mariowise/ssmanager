
from myapp.modulos.estado_1.models import Analisis
from rest_framework import serializers, viewsets

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
        documents = obj.returnDocuments()
        return DocumentSerializer(documents, many=True).data

    def get_comments(self, obj):
        comments = obj.returnComments()
        return CommentSerializer(comments, many=True).data

    def get_tags(self, obj):
        tags = obj.returnTags()
        return TagSerializer(tags, many=True).data

# ViewSets define the view behavior.
class AnalisysViewSet(viewsets.ModelViewSet):
    queryset = Analisis.objects.all()
    serializer_class = AnalisysSerializer