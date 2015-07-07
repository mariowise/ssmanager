
from myapp.modulos.estado_3.models import DefinicionRaizCATWOE
from rest_framework import serializers, viewsets

# Serializers define the API representation.
class RootDefinitionCatwoeSerializer(serializers.ModelSerializer):
    class Meta:
        model = DefinicionRaizCATWOE
        fields = (
            'id',
            'name_dr',
            'description_dr',
            'definiciones_dr',
            'definicionFinal_dr',
            'richPicture_dr',
            'clientes_dr',
            'actores_dr',
            'trans_input_dr',
            'trans_output_dr',
            'cosmo_dr',
            'propietario_dr',
            'entorno_dr',
            'comments_dr',
            'created_by',
        	'date_dr'
        )
        read_only_fields = ('comments_dr','definiciones_dr',)

# ViewSets define the view behavior.
class RootDefinitionCatwoeViewSet(viewsets.ModelViewSet):
    queryset = DefinicionRaizCATWOE.objects.all()
    serializer_class = RootDefinitionCatwoeSerializer