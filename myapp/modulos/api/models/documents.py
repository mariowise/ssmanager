
from myapp.modulos.estado_1.models import DocumentoAnalisis
from rest_framework import serializers, viewsets

# Serializers define the API representation.
class DocumentSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = DocumentoAnalisis
        fields = (
            'id',
        	'name_documento',
            'url_documento',
            'shared_documento',
            'date_documento'
        )

# ViewSets define the view behavior.
class DocumentViewSet(viewsets.ModelViewSet):
    queryset = DocumentoAnalisis.objects.all()
    serializer_class = DocumentSerializer