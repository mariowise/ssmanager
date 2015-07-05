
from django.contrib.auth.models import User
from myapp.modulos.principal.models import userProfile, userSoftSystemProject
from rest_framework import serializers, viewsets

from rest_framework.response import Response
from rest_framework.decorators import list_route
from rest_framework import status
from google.appengine.ext import db

# Serializers define the API representation.
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id',
        	'username', 
        	'first_name', 
        	'last_name', 
        	'email'
        )

# ViewSets define the view behavior.
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    filter_fields = ('username', 'email',)
    serializer_class = UserSerializer

    @list_route(methods=['post'])
    @db.transactional()
    def changepass(self, request, *args, **kwargs):
        user = User.objects.get(id = request.user.id)
        if not user.check_password(request.data.get('old_password')):
            return Response(status = status.HTTP_412_PRECONDITION_FAILED)
        else:
            user.set_password(request.data.get('new_password'))
            user.save()
            return Response(status = status.HTTP_202_ACCEPTED)

    @list_route(methods=['get'])
    def colabs(self, request, *args, **kwargs):
        user = User.objects.get(id = request.user.id)
        profile = userProfile.objects.get(user = user)
        projects = profile.contribProjects() + list(userSoftSystemProject.objects.filter(manager = user.id))
        
        colabs = []
        for p in projects: 
            for u in p.contribs_ssp:
                colab = User.objects.get(username__exact = u)
                if colab.id != user.id: colabs.append(colab)

        serializer = self.get_serializer(colabs, many = True)
        return Response(serializer.data, status = status.HTTP_200_OK)
