
from myapp.modulos.estado_1.models import StateOne
from rest_framework import serializers, viewsets

# Serializers define the API representation.
class StateOneSerializer(serializers.HyperlinkedModelSerializer):
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
    serializer_class = StateOneSerializer