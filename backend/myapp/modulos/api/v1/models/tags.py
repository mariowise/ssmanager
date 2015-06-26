
from myapp.modulos.estado_1.models import Etiqueta, StateOne
from rest_framework import serializers, viewsets

from rest_framework.response import Response
from rest_framework.decorators import detail_route
from rest_framework import status
from google.appengine.ext import db

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

    @db.transactional(xg=True)
    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)

            state = StateOne.objects.get(id=request.data["state_one_id"])
            state.tags_state.append(serializer.data["id"])
            state.save()
            
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except StateOne.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
