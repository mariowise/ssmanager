
from myapp.modulos.estado_1.models import Comentario, Media, Analisis
from myapp.modulos.estado_2.models import RichPicture
from myapp.modulos.estado_3.models import DefinicionRaizCATWOE
from rest_framework import serializers, viewsets

from rest_framework.response import Response
from rest_framework.decorators import detail_route
from rest_framework import status
from google.appengine.ext import db

from django.contrib.auth.models import User
from myapp.modulos.api.v1.models.users import UserSerializer

# Serializers define the API representation.
class CommentSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    class Meta:
        model = Comentario
        fields = (
            'id',
        	'autor_comentary',
            'date_comentary',
            'content_comentary',
            'user'
        )
    def get_user(self, obj):
        try:
            user = User.objects.get(id = obj.autor_comentary.id)
            return UserSerializer(user).data
        except User.DoesNotExist:
            return obj.autor_comentary_id

# ViewSets define the view behavior.
class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comentario.objects.all()
    serializer_class = CommentSerializer

    @db.transactional(xg=True)
    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)

            if(request.data.get("media_id", -1) != -1):
                media = Media.objects.get(id=request.data["media_id"])
                media.comments_media.append(serializer.data["id"])
                media.save()
            elif(request.data.get("catwoe_id", -1) != -1):
                catwoe = DefinicionRaizCATWOE.objects.get(id=request.data["catwoe_id"])
                catwoe.comments_dr.append(serializer.data["id"])
                catwoe.save()
            elif(request.data.get("picture_id", -1) != -1):
                picture = RichPicture.objects.get(id=request.data["picture_id"])
                picture.comments_rp.append(serializer.data["id"])
                picture.save()
            elif(request.data.get("analisys_id", -1) != -1):
                analisys = Analisis.objects.get(id=request.data["analisys_id"])
                analisys.comments_analisis.append(serializer.data["id"])
                analisys.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)
