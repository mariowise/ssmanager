
from myapp.modulos.principal.models import userProfile
from rest_framework import serializers, viewsets

# Serializers define the API representation.
class ProfileSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = userProfile
        fields = (
            'id',
        	'user',
            'email_public_user',
            'url_user',
            'company_user',
            'position_user',
            'mWeb_user',
            'mEmail_user',
            'photo_user',
            'project_colab_user',
            'id_folder_user',
            'mensajes_user_leidos',
            'mensajes_user_noleidos',
            'id_drive_folder'
        )

# ViewSets define the view behavior.
class ProfileViewSet(viewsets.ModelViewSet):
    queryset = userProfile.objects.all()
    serializer_class = ProfileSerializer