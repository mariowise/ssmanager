
from myapp.modulos.principal.models import userSoftSystemProject
from rest_framework import serializers, viewsets

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