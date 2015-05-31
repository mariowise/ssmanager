
from myapp.modulos.estado_1.models import Analisis
from rest_framework import serializers, viewsets

# Serializers define the API representation.
class AnalisysSerializer(serializers.ModelSerializer):
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
            'date_analisis'
        )

# ViewSets define the view behavior.
class AnalisysViewSet(viewsets.ModelViewSet):
    queryset = Analisis.objects.all()
    serializer_class = AnalisysSerializer