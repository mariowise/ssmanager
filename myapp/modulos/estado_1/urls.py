from django.conf.urls import patterns, url

urlpatterns = patterns('myapp.modulos.estado_1.views', 
	url(r'^project/(?P<id_ssp>.*)/$', 'general_view', name='vista_general'),
	)