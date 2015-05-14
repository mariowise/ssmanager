from django.conf.urls import patterns, include, url
# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()
import settings
urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'myapp.views.home', name='home'),
    # url(r'^myapp/', include('myapp.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
    url(r'^files/', include('gaeblob_storage.urls')),
    url(r'^', include('myapp.modulos.presentacion.urls')),
    url(r'^', include('myapp.modulos.principal.urls')),
    url(r'^', include('myapp.modulos.estado_1.urls')),
    url(r'^', include('myapp.modulos.estado_2.urls')),
    url(r'^', include('myapp.modulos.estado_3.urls')),
    url(r'^', include('myapp.modulos.proyecto.urls')),
    url(r'^', include('myapp.modulos.comunicacion.urls')),
    url(r'^api/v1/', include('myapp.modulos.api.v1.urls')),
    # url(r'^api/v1/auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^media/(?P<path>.*)$', 'django.views.static.serve', {'document_root':settings.MEDIA_ROOT}),
)
