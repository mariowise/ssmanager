from django.db import models
from myapp.modulos.principal.models import userSoftSystemProject, ListaField
from myapp.modulos.estado_1.models import Comentario
from myapp.modulos.estado_2.models import RichPicture

# Create your models here.

class StateThree(models.Model):
	ssp_stateThree = models.OneToOneField(userSoftSystemProject)
	ssp_definicionesRaices = ListaField()

	def returnDefinicionesRaices(self):
		try:
			definicionesRaicesID = self.ssp_definicionesRaices
			definicionesRaices = []

			for dr in reversed(definicionesRaicesID):
				DR = DefinicionRaizCATWOE.objects.get(id=dr)
				definicionesRaices.append(DR)
			return definicionesRaices
		except:
			return None

class DefinicionRaizCATWOE(models.Model):
	name_dr = models.CharField(max_length=200, blank=False, null=False)
	description_dr = models.TextField(max_length=500, blank=True, null=True)
	definiciones_dr = ListaField()
	definicionFinal_dr = models.CharField(max_length=200, blank=True, null=True)
	richPicture_dr = models.CharField(max_length=200, blank=True, null=True)
	clientes_dr = models.TextField(max_length=500, blank=True, null=True)
	actores_dr = models.TextField(max_length=500, blank=True, null=True)
	trans_input_dr = models.TextField(max_length=500, blank=True, null=True)
	trans_output_dr = models.TextField(max_length=500, blank=True, null=True)
	cosmo_dr = models.TextField(max_length=500, blank=True, null=True)
	propietario_dr = models.TextField(max_length=500, blank=True, null=True)
	entorno_dr = models.TextField(max_length=500, blank=True, null=True)
	comments_dr = ListaField()
	created_by = models.CharField(max_length=200, blank=True, null=True)
	date_dr = models.DateTimeField(auto_now_add=True, blank=False)

	def returnDefiniciones(self):
		try:
			definicionesID = self.definiciones_dr
			definiciones = []

			for d in reversed(definicionesID):
				D = DefinicionRaiz.objects.get(id=d)
				definiciones.append(D)
			return definiciones
		except:
			return None
	
	def returnDefinicion(self):
		try:
			definicionID = self.definicionFinal_dr
			definicion = DefinicionRaiz.objects.get(id=definicionID)
			return definicion
		except:
			return None

	def returnComments(self):
		try:
			ComentariosID = self.comments_dr
			comentariosDR = []
			for c in ComentariosID:
				cDR = Comentario.objects.get(id=c)
				comentariosDR.append(cDR)
			return comentariosDR
		except:
			return None

	def returnRichPicture(self):
		try:
			richID = self.richPicture_dr
			rich = RichPicture.objects.get(id=richID)
			return rich
		except:
			return None

class DefinicionRaiz(models.Model):
	name_DR = models.CharField(max_length=200, blank=False, null=False)
	description_DR = models.TextField(max_length=500, blank=False, null=False)
	created_by = models.CharField(max_length=200, blank=True, null=True)
	date_DR = models.DateTimeField(auto_now_add=True, blank=False)
