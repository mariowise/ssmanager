import mimetypes

from django.views.generic import View
from django.http import HttpResponse, HttpResponseNotFound

from gaeblob_storage import blobproperty_storage


class PropertyFileView(View):
    def get(self, request, *args, **kwargs):
        content = blobproperty_storage.open(kwargs['key']).read()
        mimetype = mimetypes.guess_type(content) or "application/x-octet-stream"

        if content:
            response = HttpResponse(content, mimetype=mimetype)
        else:
            response = HttpResponseNotFound()
        return response
