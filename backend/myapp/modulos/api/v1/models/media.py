
from myapp.modulos.estado_1.models import Media, Comentario
from rest_framework import serializers, viewsets

from rest_framework.response import Response
from rest_framework.decorators import detail_route

# Serializers define the API representation.
class MediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Media
        fields = (
            'id',
        	'name_media',
            'description_media',
            'url_media',
            'uploaded_by',
            'date_media',
            'type_media',
            
            'comments_media',
            'tags_media'
        )

# ViewSets define the view behavior.
class MediaViewSet(viewsets.ModelViewSet):
    queryset = Media.objects.all()
    serializer_class = MediaSerializer

    @detail_route(methods=['post'])
    def add_comment(self, request, *args, **kargs):
        media = self.get_object()
        comment = Comentario.objects.get(id=request.POST.get('comment_id'))
        media.comments_media.append(comment.id)
        media.save()
        serializer = self.get_serializer(media)
        return Response(serializer.data)