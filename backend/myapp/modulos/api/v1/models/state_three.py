
from myapp.modulos.estado_3.models import StateThree
from rest_framework import serializers, viewsets

from myapp.modulos.api.v1.models.root_definition_catwoe import RootDefinitionCatwoeSerializer

# Serializers define the API representation.
class StateThreeSerializer(serializers.ModelSerializer):
    catwoes = serializers.SerializerMethodField()

    class Meta:
        model = StateThree
        fields = (
            'id',
        	'ssp_stateThree',
            'ssp_definicionesRaices',
            'catwoes'
        )

    def get_catwoes(self, obj):
        nested = obj.returnDefinicionesRaices()
        return RootDefinitionCatwoeSerializer(nested, many = True).data

# ViewSets define the view behavior.
class StateThreeViewSet(viewsets.ModelViewSet):
    queryset = StateThree.objects.all()
    filter_fields = ('ssp_stateThree',)
    serializer_class = StateThreeSerializer