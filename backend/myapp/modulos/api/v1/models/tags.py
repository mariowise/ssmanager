
from myapp.modulos.estado_1.models import Etiqueta
from rest_framework import serializers, viewsets

# Serializers define the API representation.
class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Etiqueta
        fields = (
            'id',
        	'name_tag',
            'description_tag'
        )

# ViewSets define the view behavior.
class TagViewSet(viewsets.ModelViewSet):
    queryset = Etiqueta.objects.all()
    serializer_class = TagSerializer