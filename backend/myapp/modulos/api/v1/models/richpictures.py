
from myapp.modulos.estado_2.models import StateTwo, RichPicture
from myapp.modulos.api.v1.models.documents import DocumentSerializer
from myapp.modulos.api.v1.models.comments import CommentSerializer
from rest_framework import serializers, viewsets

from rest_framework.response import Response
from rest_framework.decorators import detail_route
from rest_framework import status
from google.appengine.ext import db

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

    @detail_route(methods=['post'])
    @db.transactional(xg=True)
    def delete(self, request, *args, **kargs):
        try:
            rp = self.get_object()
            state = StateTwo.objects.get(id=request.data['statetwo_id'])

            if rp.id in state.ssp_richPictures: state.ssp_richPictures.remove(rp.id)
            else: raise StateTwo.DoesNotExist

            state.save()
            rp.delete()
            return Response(status=status.HTTP_202_ACCEPTED)
        except StateTwo.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    