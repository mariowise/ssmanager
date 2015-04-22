
from django.conf.urls import url, include
from myapp.modulos.api.v1.models.users import UserViewSet
from myapp.modulos.api.v1.models.profiles import ProfileViewSet
from myapp.modulos.api.v1.models.projects import ProjectViewSet

from myapp.modulos.api.v1.models.state_one import StateOneViewSet
from myapp.modulos.api.v1.models.media import MediaViewSet
from myapp.modulos.api.v1.models.documents import DocumentViewSet
from myapp.modulos.api.v1.models.tags import TagViewSet
from myapp.modulos.api.v1.models.analisys import AnalisysViewSet

from myapp.modulos.api.v1.models.comments import CommentViewSet
from myapp.modulos.api.v1.models.messages import MessageViewSet
from myapp.modulos.api.v1.models.notifications import NotificationViewSet

from myapp.modulos.api.v1.models.state_two import StateTwoViewSet
from myapp.modulos.api.v1.models.richpictures import RichpictureViewSet

from myapp.modulos.api.v1.models.state_three import StateThreeViewSet
from myapp.modulos.api.v1.models.root_definition_catwoe import RootDefinitionCatwoeViewSet
from myapp.modulos.api.v1.models.root_definition import RootDefinitionViewSet

from rest_framework import routers

# Routers provide an easy way of automatically determining the URL conf.
router = routers.DefaultRouter()

# Azules
router.register(r'users', UserViewSet)
router.register(r'profiles', ProfileViewSet)
router.register(r'projects', ProjectViewSet)
# router.register(r'credentials', CredentialViewSet)

# Amarillos
router.register(r'state_one', StateOneViewSet)
router.register(r'media', MediaViewSet)
router.register(r'documents', DocumentViewSet)
router.register(r'tags', TagViewSet)
router.register(r'analisys', AnalisysViewSet)

# Verde
router.register(r'comments', CommentViewSet)
router.register(r'messages', MessageViewSet)
router.register(r'notifications', NotificationViewSet)

# Purpura
router.register(r'state_two', StateTwoViewSet)
router.register(r'richpictures', RichpictureViewSet)

# Blanco
router.register(r'state_three', StateThreeViewSet)
router.register(r'root_definition_catwoe', RootDefinitionCatwoeViewSet)
router.register(r'root_definition', RootDefinitionViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    url(r'^', include(router.urls)),
    # url(r'^auth/', include('rest_framework.urls', namespace='rest_framework'))
]
