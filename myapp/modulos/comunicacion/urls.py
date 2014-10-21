from django.conf.urls import patterns, url

urlpatterns = patterns('myapp.modulos.comunicacion.views', 
	url(r'^enviarMensaje/(?P<id_ssp>.*)/$', 'enviarMensaje_view'),
	url(r'^mensajes/(?P<page>.*)/$', 'verMensajes_view'),
	url(r'^verMensaje/(?P<id_mensaje>.*)/$', 'verMensaje_view'),
	url(r'^eliminarMensaje/(?P<id_mensaje>.*)/$', 'eliminarMensaje_view'),
	url(r'^wsNotificaciones/(?P<id_ssp>.*)/$', 'notificacion_json_view'),
	url(r'^verNotificacion/(?P<id_noti>.*)/(?P<id_ssp>.*)/$', 'notificacion_ver_view'),
	url(r'^notificaciones/(?P<id_ssp>.*)/(?P<page>.*)/$', 'notificacion_all_view'),
	
	)