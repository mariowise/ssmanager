
from myapp.modulos.principal.models import userSoftSystemProject
from myapp.modulos.estado_1.models import StateOne
from myapp.modulos.estado_2.models import StateTwo
from myapp.modulos.estado_3.models import StateThree
from rest_framework import serializers, viewsets

from rest_framework.response import Response
from rest_framework.decorators import detail_route
from rest_framework import status
from google.appengine.ext import db

# Serializers define the API representation.
class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = userSoftSystemProject
        fields = (
            'id',
        	'manager', 
        	'name_ssp',
        	'description_ssp',
        	'date_spp',
        	'id_folder_ssp',

        	# Listas
        	'contribs_ssp',
        	'notificaciones_ssp',
        	'ids_folder_ssp'
        )

# ViewSets define the view behavior.
class ProjectViewSet(viewsets.ModelViewSet):
    queryset = userSoftSystemProject.objects.all()
    filter_fields = ('manager', 'name_ssp',)
    serializer_class = ProjectSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)

        project = userSoftSystemProject.objects.get(id=serializer.data["id"])
        StateOne.objects.create(ssp_stateOne = project)
        StateTwo.objects.create(ssp_stateTwo = project)
        StateThree.objects.create(ssp_stateThree = project)

        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
