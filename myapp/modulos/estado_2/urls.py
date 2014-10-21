from django.conf.urls import patterns, url

urlpatterns = patterns('myapp.modulos.estado_2.views', 
	url(r'^project-state-two/(?P<id_ssp>.*)/$', 'general_dos_view'),
	url(r'^richPictures/(?P<id_ssp>.*)/(?P<page>.*)/$', 'richPictures_view'),
	url(r'^newRichPicture/(?P<id_ssp>.*)/$', 'richPicture_crear_view'),
	url(r'^eliminarRichPicture/(?P<id_ssp>.*)/(?P<id_rp>.*)/$', 'richPicture_eliminar_view'),
	url(r'^desarrolloRichPicture/(?P<id_ssp>.*)/(?P<id_rp>.*)/$', 'richPicture_desarrollo_view'),
	url(r'^eliminarDrawRichPicture/(?P<id_ssp>.*)/(?P<id_rp>.*)/(?P<id_documento>.*)/$', 'richPicture_eliminarDocumento_view'),
	url(r'^resumenRichPicture/(?P<id_rp>.*)/$', 'resumen_richPicture_view'),
	url(r'^drawRichPicture/(?P<id_ssp>.*)/(?P<id_rp>.*)/$', 'richPicture_newDocumento_view'),
	url(r'^adjuntarAnalisis/(?P<id_rp>.*)/$', 'richPicture_adjuntarAnalisis_view'),
	url(r'^adjuntarDraw/(?P<id_rp>.*)/$', 'richPicture_adjuntarDraw_view'),
	url(r'^verRichPicture/(?P<id_ssp>.*)/(?P<id_rp>.*)/$', 'richPicture_single_view'),
	url(r'^comentarRichPicture/(?P<id_rp>.*)/(?P<id_ssp>.*)/$', 'comentar_richPicture_view'),
	


	)