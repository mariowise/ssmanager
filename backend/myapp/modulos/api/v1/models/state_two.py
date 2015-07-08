
from myapp.modulos.estado_2.models import StateTwo
from rest_framework import serializers, viewsets

from myapp.modulos.api.v1.models.richpictures import RichpictureSerializer

# Serializers define the API representation.
class StateTwoSerializer(serializers.ModelSerializer):
    class Meta:
        model = StateTwo
        fields = (
            'id',
        	'ssp_stateTwo',
            'ssp_richPictures'
        )

# ViewSets define the view behavior.
class StateTwoViewSet(viewsets.ModelViewSet):
    queryset = StateTwo.objects.all()
    filter_fields = ('ssp_stateTwo',)
    serializer_class = StateTwoSerializer