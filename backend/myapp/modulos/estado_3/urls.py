from django.conf.urls import patterns, url

urlpatterns = patterns('myapp.modulos.estado_3.views', 
	url(r'^project-state-three/(?P<id_ssp>.*)/$', 'general_tres_view'),
	url(r'^definicionesRaices/(?P<id_ssp>.*)/(?P<page>.*)/$', 'definicionesRaiz_view'),
	url(r'^newDefinicionRaiz/(?P<id_ssp>.*)/$', 'definicionRaiz_crear_view'),
	url(r'^eliminarDefinicionRaiz/(?P<id_ssp>.*)/(?P<id_dr>.*)/$', 'definicionRaiz_eliminar_view'),
	url(r'^desarrolloDefinicionRaiz/(?P<id_ssp>.*)/(?P<id_dr>.*)/$', 'definicionRaiz_desarrollo_view'),
	url(r'^newCatwoe/(?P<id_dr>.*)/$', 'definicionRaiz_newCatwoe_view'),
	url(r'^adjuntarRichPicture/(?P<id_dr>.*)/$', 'definicionRaiz_adjuntarRichPicture_view'),
	url(r'^adjuntarDefinicionRaiz/(?P<id_dr>.*)/$', 'definicionRaiz_adjuntarDefinicionRaiz_view'),
	url(r'^addDefinicionRaiz/(?P<id_dr>.*)/$', 'definicionRaiz_add_view'),
	url(r'^eliminarDF/(?P<id_ssp>.*)/(?P<id_dr>.*)/(?P<id_dr2>.*)/$', 'DF_eliminar_view'),
	url(r'^resumenDefinicionRaiz/(?P<id_dr>.*)/$', 'definicionRaiz_resumen_view'),
	url(r'^verDefinicionRaiz/(?P<id_ssp>.*)/(?P<id_dr>.*)/$', 'definicionRaiz_single_view'),
	url(r'^comentarDefinicionRaiz/(?P<id_dr>.*)/(?P<id_ssp>.*)/$', 'definicionRaiz_comentar_view'),

	)