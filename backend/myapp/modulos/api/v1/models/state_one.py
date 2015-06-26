
from myapp.modulos.estado_1.models import StateOne, Etiqueta
from rest_framework import serializers, viewsets

from rest_framework.response import Response
from rest_framework.decorators import detail_route
from rest_framework import status
from google.appengine.ext import db

# Serializers define the API representation.
class StateOneSerializer(serializers.ModelSerializer):
    class Meta:
        model = StateOne
        fields = (
            'id',
        	'ssp_stateOne',
            'ssp_videos',
            'ssp_imagenes',
            'ssp_audios',
            'ssp_documentos',
            'ssp_analisis',
            'tags_state'
        )

# ViewSets define the view behavior.
class StateOneViewSet(viewsets.ModelViewSet):
    queryset = StateOne.objects.all()
    filter_fields = ('ssp_stateOne',)
    serializer_class = StateOneSerializer

    @detail_route(methods=['post'])
    @db.transactional(xg=True)
    def delete_tag(self, request, *args, **kargs):
        try:
            state = self.get_object()
            tag = Etiqueta.objects.get(id=request.data['tag_id'])

            if tag.id in state.tags_state: state.tags_state.remove(tag.id)
            state.save()
            tag.delete()

            serializer = self.get_serializer(state)
            return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
        except Etiqueta.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
