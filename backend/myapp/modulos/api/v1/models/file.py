
from django.db import models
from django.contrib.auth.models import User

from rest_framework import serializers
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.viewsets import ModelViewSet

from time import time

def get_upload_file_name(instance, filename):
	return "Files/%s_%s" % (str(time()).replace(".", "_"), filename)

class FileUpload(models.Model):
	reated = models.DateTimeField(auto_now_add=True)
	owner = models.ForeignKey(User, to_field='id')
	datafile = models.FileField(upload_to=get_upload_file_name)

class FileUploadSerializer(serializers.HyperlinkedModelSerializer):
	owner = serializers.SlugRelatedField(read_only=True,slug_field='id')

	class Meta:
		model = FileUpload
		read_only_fields = (
			'created', 
			'datafile', 
			'owner'
		)

class FileUploadViewSet(ModelViewSet):
	queryset = FileUpload.objects.all()
	serializer_class = FileUploadSerializer
	parser_classes = (MultiPartParser, FormParser,)

	def perform_create(self, serializer):
		serializer.save(owner=self.request.user,
			datafile=self.request.data.get('datafile'))

