
from myapp.modulos.principal.models import userProfile
from rest_framework import serializers, viewsets

# Serializers define the API representation.
class ProfileSerializer(serializers.ModelSerializer):
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
            'photo_url',
            'project_colab_user',
            'id_folder_user',
            'mensajes_user_leidos',
            'mensajes_user_noleidos',
            'id_drive_folder'
        )
        read_only_fields = ('mensajes_user_leidos','mensajes_user_noleidos',)

# ViewSets define the view behavior.
class ProfileViewSet(viewsets.ModelViewSet):
    queryset = userProfile.objects.all()
    filter_fields = ('user',)
    serializer_class = ProfileSerializer