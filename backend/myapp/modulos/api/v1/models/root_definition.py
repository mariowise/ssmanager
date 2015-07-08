
from myapp.modulos.estado_3.models import DefinicionRaiz, DefinicionRaizCATWOE
from rest_framework import serializers, viewsets

from rest_framework.response import Response
from rest_framework.decorators import detail_route
from rest_framework import status
from google.appengine.ext import db

# Serializers define the API representation.
class RootDefinitionSerializer(serializers.ModelSerializer):
    class Meta:
        model = DefinicionRaiz
        fields = (
            'id',
            'name_DR',
            'description_DR',
            'created_by',
            'date_DR'
        )

# ViewSets define the view behavior.
class RootDefinitionViewSet(viewsets.ModelViewSet):
    queryset = DefinicionRaiz.objects.all()
    serializer_class = RootDefinitionSerializer

    @db.transactional(xg=True)
    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)

            catwoe = DefinicionRaizCATWOE.objects.get(id=request.data.get("catwoe_id"))
            catwoe.definiciones_dr.append(serializer.data["id"])
            catwoe.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except:
            return Response(status=404)

    @detail_route(methods=['post'])
    @db.transactional(xg=True)
    def remove(self, request, *args, **kwargs):
        instance = self.get_object()
        
        if(request.data.get("catwoe_id", -1) != -1):
            catwoe = DefinicionRaizCATWOE.objects.get(id = request.data.get("catwoe_id"))
            if instance.id in catwoe.definiciones_dr: catwoe.definiciones_dr.remove(instance.id)
            catwoe.save()
        
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
