
from myapp.modulos.estado_3.models import DefinicionRaiz
from rest_framework import serializers, viewsets

# Serializers define the API representation.
class RootDefinitionSerializer(serializers.ModelSerializer):
    class Meta:
        model = DefinicionRaiz
        fields = (
            'id',
            'name_DR',
            'description_DR',
            'created_by',
            'date_DR'
        )

# ViewSets define the view behavior.
class RootDefinitionViewSet(viewsets.ModelViewSet):
    queryset = DefinicionRaiz.objects.all()
    serializer_class = RootDefinitionSerializer