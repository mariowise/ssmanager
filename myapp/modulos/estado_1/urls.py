from django.conf.urls import patterns, url

urlpatterns = patterns('myapp.modulos.estado_1.views', 
	url(r'^project/(?P<id_ssp>.*)/$', 'general_uno_view', name='vista_general'),
	url(r'^medias/(?P<id_type>.*)/(?P<id_ssp>.*)/(?P<page>.*)/$', 'media_view', name='vista_media'),
    url(r'^agregar/(?P<id_ssp>.*)/$', 'media_agregar_view', name='vista_media_agregar'),
	url(r'^verMedia/(?P<id_ssp>.*)/(?P<id_media>.*)/$', 'media_ver_view', name='vista_media_ver'),
	url(r'^comentarMedia/(?P<id_media>.*)/$', 'comentar_media_view', name='vista_comentar_media'),
	url(r'^etiquetarMedia/(?P<id_media>.*)/$', 'etiquetar_media_view', name='vista_etiquetar_media'),
	url(r'^crearEtiqueta/(?P<id_ssp>.*)/$', 'crear_etiqueta_view', name='vista_crear_etiqueta'),
	url(r'^eliminarEtiquetaMedia/(?P<id_media>.*)/(?P<id_tag>.*)/$', 'eliminar_etiqueta_media_view', name='vista_eliminar_etiqueta_media'),
	url(r'^eliminarMedia/(?P<id_ssp>.*)/(?P<id_media>.*)/$', 'eliminar_media_view', name='vista_eliminar_media'),
    url(r'^analisis/(?P<id_ssp>.*)/(?P<page>.*)/$', 'analisis_view', name='vista_analisis'),
    url(r'^newAnalisis/(?P<id_ssp>.*)/$', 'analisis_crear_view', name='vista_analisis_crear'),
	url(r'^eliminarAnalisis/(?P<id_ssp>.*)/(?P<id_analisis>.*)/$', 'analisis_eliminar_view'),
	url(r'^desarrolloAnalisis/(?P<id_ssp>.*)/(?P<id_analisis>.*)/$', 'analisis_desarrollo_view'),
    url(r'^newDocumento/(?P<id_analisis>.*)/$', 'analisis_newDocumento_view'),
    url(r'^eliminarDocumento/(?P<id_analisis>.*)/(?P<id_documento>.*)/$', 'analisis_eliminarDocumento_view'),
	url(r'^eliminarEtiquetaAnalisis/(?P<id_analisis>.*)/(?P<id_tag>.*)/$', 'eliminar_etiqueta_analisis_view'),
	url(r'^etiquetarAnalisis/(?P<id_analisis>.*)/$', 'etiquetar_analisis_view'),

	)