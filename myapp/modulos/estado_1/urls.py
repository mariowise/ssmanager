from django.conf.urls import patterns, url

urlpatterns = patterns('myapp.modulos.estado_1.views', 
	url(r'^project/(?P<id_ssp>.*)/$', 'general_uno_view', name='vista_general'),
	url(r'^medias/(?P<id_type>.*)/(?P<id_ssp>.*)/$', 'media_view', name='vista_media'),
    url(r'^agregar/(?P<id_ssp>.*)/$', 'media_agregar_view', name='vista_media_agregar'),
	url(r'^verMedia/(?P<id_ssp>.*)/(?P<id_media>.*)/$', 'media_ver_view', name='vista_media_ver'),
	url(r'^comentarMedia/(?P<id_media>.*)/$', 'comentar_media_view', name='vista_comentar_media'),
	url(r'^etiquetarMedia/(?P<id_media>.*)/$', 'etiquetar_media_view', name='vista_etiquetar_media'),
	url(r'^crearEtiqueta/(?P<id_ssp>.*)/$', 'crear_etiqueta_view', name='vista_crear_etiqueta'),
	url(r'^eliminarEtiquetaMedia/(?P<id_media>.*)/(?P<id_tag>.*)/$', 'eliminar_etiqueta_media_view', name='vista_eliminar_etiqueta_media'),
	url(r'^eliminarMedia/(?P<id_ssp>.*)/(?P<id_media>.*)/$', 'eliminar_media_view', name='vista_eliminar_media'),

	)