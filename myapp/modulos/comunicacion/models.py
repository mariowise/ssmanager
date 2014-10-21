from django.db import models
from djangotoolbox.fields import ListField
from django.contrib.auth.models import User
from myapp.modulos.principal.forms import StringListField


# Create your models here.
class ListaMensajes(ListField):
    def formfield(self, **kwargs):
        return models.Field.formfield(self, StringListField, **kwargs)

class Mensaje(models.Model):
	remitente_mensaje = models.CharField(max_length=200, blank=False, null=False)
	receptores_mensaje = ListaMensajes()
	asunto_mensaje = models.CharField(max_length=200, blank=False, null=False)
	contenido_mensaje = models.TextField(max_length=500, blank=False, null=False)
	date_mensaje = models.DateTimeField(auto_now_add=True, blank=False)
	proyecto_mensaje = models.CharField(max_length=200, blank=False, null=False)
	url_asoc_mensaje = models.CharField(max_length=500, blank=True, null=True)

	def returnReceptores(self):
		receptoresID = self.receptores_mensaje
		receptores = []
		for r in receptoresID:
			R = User.objects.get(id=r)
			receptores.append(R)
		return receptores

	def returnRemitente(self):
		username = self.remitente_mensaje
		user = User.objects.get(username__exact=username)
		return user

class Notificacion(models.Model):
	creador_notificacion =  models.CharField(max_length=200, blank=False, null=False)
	imagen_notificacion = models.CharField(max_length=200, blank=False, null=False)
	accion_notificacion =  models.CharField(max_length=200, blank=False, null=False)
	url_notificacion =  models.CharField(max_length=200, blank=False, null=False)
	date_notificacion = models.DateTimeField(auto_now_add=True, blank=False)
	users_noRead_notificacion = ListaMensajes()
	id_asoc_notificacion = models.CharField(max_length=200, blank=False, null=False)
	type_notificacion = models.CharField(max_length=200, blank=False, null=False)

	def __unicode__(self):
		return self.accion_notificacion





