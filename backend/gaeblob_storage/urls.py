from django.conf.urls.defaults import *

from gaeblob_storage.views import PropertyFileView


urlpatterns = patterns('',
   url(r'^serve/(?P<key>[\w\.\/\-_]+)/$', PropertyFileView.as_view(), name='gaeblob_serve'),
)
