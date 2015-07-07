
from myapp.modulos.principal.models import userSoftSystemProject, userProfile
from myapp.modulos.estado_1.models import StateOne
from myapp.modulos.estado_2.models import StateTwo
from myapp.modulos.estado_3.models import StateThree
from myapp.modulos.comunicacion.models import Mensaje
from django.contrib.auth.models import User
from rest_framework import serializers, viewsets

from rest_framework.response import Response
from rest_framework.decorators import detail_route
from rest_framework import status
from google.appengine.ext import db

from myapp.modulos.api.v1.models.users import UserSerializer
from myapp.modulos.api.v1.models.state_three import StateThreeSerializer

# Serializers define the API representation.
class ProjectSerializer(serializers.ModelSerializer):
    contribs = serializers.SerializerMethodField()
    state_three = serializers.SerializerMethodField()

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
        	'ids_folder_ssp',

            #Nested
            'state_three',
            'contribs'
        )

    def get_state_three(self, obj):
        nested = StateThree.objects.get(ssp_stateThree = obj)
        return StateThreeSerializer(nested).data

    def get_contribs(self, obj):
        contribs = obj.contribUsers()
        return UserSerializer(contribs, many = True).data


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

    @detail_route(methods=['post'])
    def invite_contrib(self, request, *args, **kwargs):
        project = self.get_object()
        guest = User.objects.get(id = request.data.get("user_id"))
        
        message = Mensaje.objects.create(
            remitente_mensaje = request.user.get_username(), 
            asunto_mensaje = 'Invitacion', 
            contenido_mensaje = '%s te ha invitado a que colabores en su proyecto %s'%(request.user.get_username(), project.name_ssp), 
            proyecto_mensaje = project.id, 
            url_asoc_mensaje = '/aceptarInvitacion/%s/%s'%(project.id, guest.id)
        )
        message.receptores_mensaje.append(guest.id)
        message.save()
        
        profile = userProfile.objects.get(user = guest.id)
        userProfile.add_message_nl(profile.id, message.id)

        return Response(status=status.HTTP_201_CREATED)

    @detail_route(methods=['post'])
    def rm_contrib(self, request, *args, **kwargs):
        project = self.get_object()
        user = User.objects.get(username = request.data.get('username'))
        profile = userProfile.objects.get(user = user)
        
        userSoftSystemProject.rm_contrib(project.id, user.username)
        userProfile.rm_project(profile.id, project.id)

        return Response(status=200)

    @detail_route(methods=['get'])
    def contribs(self, request, *args, **kwargs):
        project = self.get_object()
        serializer = UserSerializer(project.contribUsers(), many=True)
        return Response(serializer.data, status=200)

    @detail_route(methods=['get'])
    def state_three(self, request, *args, **kwargs):
        project = self.get_object()
        state = StateThree.objects.get(ssp_stateThree = project)
        serializer = StateThreeSerializer(state)
        return Response(serializer.data, status=200)

