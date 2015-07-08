
from myapp.modulos.estado_1.models import DocumentoAnalisis
from rest_framework import serializers, viewsets

# Serializers define the API representation.
class DocumentSerializer(serializers.ModelSerializer):
    google_id = serializers.SerializerMethodField()

    class Meta:
        model = DocumentoAnalisis
        fields = (
            'id',
        	'name_documento',
            'url_documento',
            'shared_documento',
            'date_documento',
            'google_id'
        )

    def get_google_id(self, obj):
        ls = obj.url_documento.split("/")
        return ls[ls.index("d")+1]

# ViewSets define the view behavior.
class DocumentViewSet(viewsets.ModelViewSet):
    queryset = DocumentoAnalisis.objects.all()
    serializer_class = DocumentSerializer