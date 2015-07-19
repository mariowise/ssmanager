
from myapp.modulos.estado_2.models import RichPicture
from rest_framework import serializers, viewsets

from myapp.modulos.api.v1.models.documents import DocumentSerializer
from myapp.modulos.api.v1.models.comments import CommentSerializer

# Serializers define the API representation.
class RichpictureSerializer(serializers.ModelSerializer):
    comments = serializers.SerializerMethodField()

    class Meta:
        model = RichPicture
        fields = (
            'id',
        	'name_rp',
            'description_rp',
            'analisis_rp',
            'documentos_rp',
            'richPFinal_rp',
            'comments_rp',
            'created_by',
            'date_rp',

            'comments'
        )
        read_only_fields = ('documentos_rp','comments_rp',)

    def get_comments(self, obj):
        comments = obj.returnComments()
        return CommentSerializer(comments, many = True).data

# ViewSets define the view behavior.
class RichpictureViewSet(viewsets.ModelViewSet):
    queryset = RichPicture.objects.all()
    filter_fields = ('created_by',)
    serializer_class = RichpictureSerializer

    