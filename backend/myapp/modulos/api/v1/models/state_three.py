
from myapp.modulos.estado_3.models import StateThree
from rest_framework import serializers, viewsets

# Serializers define the API representation.
class StateThreeSerializer(serializers.ModelSerializer):
    class Meta:
        model = StateThree
        fields = (
            'id',
        	'ssp_stateThree',
            'ssp_definicionesRaices'
        )

# ViewSets define the view behavior.
class StateThreeViewSet(viewsets.ModelViewSet):
    queryset = StateThree.objects.all()
    serializer_class = StateThreeSerializer