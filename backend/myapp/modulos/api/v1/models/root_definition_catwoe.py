
from myapp.modulos.estado_3.models import StateThree, DefinicionRaizCATWOE
from rest_framework import serializers, viewsets

from rest_framework.response import Response
from rest_framework.decorators import detail_route
from rest_framework import status
from google.appengine.ext import db

from myapp.modulos.api.v1.models.comments import CommentSerializer
from myapp.modulos.api.v1.models.root_definition import RootDefinitionSerializer

# Serializers define the API representation.
class RootDefinitionCatwoeSerializer(serializers.ModelSerializer):
    comments = serializers.SerializerMethodField()
    roots = serializers.SerializerMethodField()

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
        	'date_dr',

            'comments',
            'roots'
        )
        read_only_fields = ('comments_dr','definiciones_dr',)

    def get_comments(self, obj):
        comments = obj.returnComments()
        return CommentSerializer(comments, many = True).data

    def get_roots(self, obj):
        roots = obj.returnDefiniciones()
        return RootDefinitionSerializer(roots, many = True).data

# ViewSets define the view behavior.
class RootDefinitionCatwoeViewSet(viewsets.ModelViewSet):
    queryset = DefinicionRaizCATWOE.objects.all()
    serializer_class = RootDefinitionCatwoeSerializer

    @db.transactional(xg=True)
    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)

            state = StateThree.objects.get(id = request.data.get("state_id"))
            state.ssp_definicionesRaices.append(serializer.data["id"])
            state.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)

