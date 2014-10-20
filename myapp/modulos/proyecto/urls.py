from django.conf.urls import patterns, url

urlpatterns = patterns('myapp.modulos.proyecto.views', 
	url(r'^addContrib/(?P<id_ssp>.*)/$', 'contrib_view', name='vista_contrib'),
	url(r'^profile/(?P<id_ssp>.*)/(?P<id_user>.*)/$', 'profile_view', name='vista_profile'),
	url(r'^delContrib/(?P<id_ssp>.*)/(?P<id_user>.*)/$', 'desvincularColaborador_view', name='vista_delContrib'),
	url(r'^aceptarInvitacion/(?P<id_ssp>.*)/(?P<id_user>.*)/(?P<id_mensaje>.*)/$', 'invitacion_view'),

	)