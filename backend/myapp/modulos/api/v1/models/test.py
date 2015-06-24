
from django.db import models
from rest_framework import serializers
from rest_framework.viewsets import ModelViewSet

from rest_framework.response import Response
from rest_framework.decorators import detail_route

class TestEntity(models.Model):
	name = models.CharField(max_length=200, blank=False, null=False)
	lastname = models.CharField(max_length=200, blank=False, null=False)

class TestEntitySerializer(serializers.ModelSerializer):
	class Meta:
		model = TestEntity
		fields = (
			'id',
			'name', 
			'lastname'
		)

class TestEntityViewSet(ModelViewSet):
	queryset = TestEntity.objects.all()
	filter_fields = ('name', 'lastname',)
	serializer_class = TestEntitySerializer

	@detail_route(methods=['post'])
	def set_name(self, request, *args, **kwargs):
		instance = self.get_object()
		instance.name = request.POST.get('name')
		instance.save()
		serializer = self.get_serializer(instance)
		return Response(serializer.data)

	# def get_object(self):
	# 	if self.request.method == 'PUT':
	# 		return TestEntity.objects.get_or_create(id = self.kwargs.get('id'))
	# 	else:
	# 		return super(TestEntityViewSet, self).get_object()
