
from myapp.modulos.principal.models import userSoftSystemProject
from rest_framework import serializers, viewsets

# Serializers define the API representation.
class ProjectSerializer(serializers.HyperlinkedModelSerializer):
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
    serializer_class = ProjectSerializer