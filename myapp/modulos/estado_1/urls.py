from django.conf.urls import patterns, url

urlpatterns = patterns('myapp.modulos.estado_1.views', 
	url(r'^project/(?P<id_ssp>.*)/$', 'general_uno_view'),
	url(r'^medias/(?P<id_type>.*)/(?P<id_ssp>.*)/(?P<page>.*)/$', 'media_view'),
    url(r'^agregar/(?P<id_ssp>.*)/$', 'media_agregar_view'),
	url(r'^verMedia/(?P<id_ssp>.*)/(?P<id_media>.*)/$', 'media_ver_view'),
	url(r'^comentarMedia/(?P<id_media>.*)/$', 'comentar_media_view'),
	url(r'^etiquetarMedia/(?P<id_media>.*)/$', 'etiquetar_media_view'),
	url(r'^crearEtiqueta/(?P<id_ssp>.*)/$', 'crear_etiqueta_view'),
	url(r'^eliminarEtiquetaMedia/(?P<id_media>.*)/(?P<id_tag>.*)/$', 'eliminar_etiqueta_media_view'),
	url(r'^eliminarMedia/(?P<id_ssp>.*)/(?P<id_media>.*)/$', 'eliminar_media_view'),
    url(r'^analisis/(?P<id_ssp>.*)/(?P<page>.*)/$', 'analisis_view'),
    url(r'^newAnalisis/(?P<id_ssp>.*)/$', 'analisis_crear_view'),
	url(r'^eliminarAnalisis/(?P<id_ssp>.*)/(?P<id_analisis>.*)/$', 'analisis_eliminar_view'),
	url(r'^desarrolloAnalisis/(?P<id_ssp>.*)/(?P<id_analisis>.*)/$', 'analisis_desarrollo_view'),
    url(r'^newDocumento/(?P<id_analisis>.*)/$', 'analisis_newDocumento_view'),
    url(r'^eliminarDocumento/(?P<id_analisis>.*)/(?P<id_documento>.*)/$', 'analisis_eliminarDocumento_view'),
	url(r'^eliminarEtiquetaAnalisis/(?P<id_analisis>.*)/(?P<id_tag>.*)/$', 'eliminar_etiqueta_analisis_view'),
	url(r'^etiquetarAnalisis/(?P<id_analisis>.*)/$', 'etiquetar_analisis_view'),
	url(r'^resumenAnalisis/(?P<id_analisis>.*)/$', 'resumen_analisis_view'),
	url(r'^verAnalisis/(?P<id_ssp>.*)/(?P<id_analisis>.*)/$', 'analisis_ver_view'),
	url(r'^comentarAnalisis/(?P<id_analisis>.*)/$', 'comentar_analisis_view'),


	)