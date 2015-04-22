
from myapp.modulos.estado_1.models import Media
from rest_framework import serializers, viewsets

# Serializers define the API representation.
class MediaSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Media
        fields = (
            'id',
        	'name_media',
            'description_media',
            'url_media',
            'comments_media',
            'tags_media',
            'uploaded_by',
            'date_media',
            'uploaded_by',
            'type_media'
        )

# ViewSets define the view behavior.
class MediaViewSet(viewsets.ModelViewSet):
    queryset = Media.objects.all()
    serializer_class = MediaSerializer