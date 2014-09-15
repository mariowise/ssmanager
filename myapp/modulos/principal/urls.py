from django.conf.urls import patterns, url

urlpatterns = patterns('myapp.modulos.principal.views', 
	url(r'^principal/$', 'principal_view', name='vista_principal'),
	url(r'^principal/user/account/settings/$', 'settings_view', name='vista_settings'),
	url(r'^principal/user/account/password/$', 'password_change_view', name='vista_password'),
	url(r'^principal/user/account/notification/$', 'notification_settings_view', name='vista_notification'),
	url(r'^principal/user/new/ssp/$', 'create_ssp_view', name='vista_newProject'),
	url(r'^principal/user/account/projects/$', 'projects_view', name='vista_projects'),
	)