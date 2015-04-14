from django.conf.urls import patterns, url

urlpatterns = patterns('myapp.modulos.api.views', 
	
	# Projects
	url(r'^user_softsystem_project/$', 'user_softsystem_project_index', name='user_softsystem_project_index'),
	url(r'^user_softsystem_project/([a-zA-Z0-9]+)/$', 'user_softsystem_project_show', name='user_softsystem_project_show'),
	url(r'^user_softsystem_project/([a-zA-Z0-9]+)/edit/$', 'user_softsystem_project_edit', name='user_softsystem_project_edit'),
	url(r'^user_softsystem_project/([a-zA-Z0-9]+)/destroy/$', 'user_softsystem_project_destroy', name='user_softsystem_project_destroy'),

)