from django.conf.urls import patterns, url

urlpatterns = patterns('myapp.modulos.presentacion.views', 
	url(r'^$', 'welcome_view', name='vista_welcome'),
	url(r'^tour/$', 'tour_view', name='vista_tour'),
	url(r'^method/$', 'method_view', name='vista_method'),
	url(r'^about/$', 'about_view', name='vista_about'),
	url(r'^sign_up/$', 'signup_view', name='vista_signup'),
	url(r'^login/$', 'login_view', name='vista_login'),
	url(r'^logout/$', 'logout_view', name='vista_logout'),
	url(r'^recover/$', 'recover_view', name='vista_recover'),
	url(r'^oauth2callback/$', 'auth_return'),
	)