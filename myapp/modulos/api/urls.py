# from django.conf.urls import patterns, url

# urlpatterns = patterns('myapp.modulos.api.views', 

# 	# Projects
# 	url(r'^user_softsystem_project/$', 'user_softsystem_project_index', name='user_softsystem_project_index'),
# 	url(r'^user_softsystem_project/([a-zA-Z0-9]+)/$', 'user_softsystem_project_show', name='user_softsystem_project_show'),
# 	url(r'^user_softsystem_project/([a-zA-Z0-9]+)/edit/$', 'user_softsystem_project_edit', name='user_softsystem_project_edit'),
# 	url(r'^user_softsystem_project/([a-zA-Z0-9]+)/destroy/$', 'user_softsystem_project_destroy', name='user_softsystem_project_destroy'),

# )

from django.conf.urls import url, include
from django.contrib.auth.models import User
from rest_framework import routers, serializers, viewsets

# Serializers define the API representation.
class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name')

# ViewSets define the view behavior.
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

# Routers provide an easy way of automatically determining the URL conf.
router = routers.DefaultRouter()
router.register(r'users', UserViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]
