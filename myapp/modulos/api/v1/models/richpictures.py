
from myapp.modulos.estado_2.models import RichPicture
from rest_framework import serializers, viewsets

# Serializers define the API representation.
class RichpictureSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = RichPicture
        fields = (
            'id',
        	'name_rp',
            'description_rp',
            'analisis_rp',
            'documentos_rp',
            'richPFinal_rp',
            'comments_rp',
            'created_by',
            'date_rp'
        )

# ViewSets define the view behavior.
class RichpictureViewSet(viewsets.ModelViewSet):
    queryset = RichPicture.objects.all()
    serializer_class = RichpictureSerializer