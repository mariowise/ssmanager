from django.db import models
from myapp.modulos.principal.models import userSoftSystemProject, ListaField
from myapp.modulos.estado_1.models import Analisis, Comentario, DocumentoAnalisis 
# Create your models here.

class StateTwo(models.Model):
	ssp_stateTwo = models.OneToOneField(userSoftSystemProject)
	ssp_richPictures = ListaField()

	def returnRichPictures(self):
		try: 
			richPicturesID = self.ssp_richPictures
			RichPictures = []

			for rP in reversed(richPicturesID):
				RP = RichPicture.objects.get(id=rP)
				RichPictures.append(RP)
			return RichPictures
		except:
			return None

class RichPicture(models.Model):
	name_rp = models.CharField(max_length=200, blank=False, null=False)
	description_rp = models.TextField(max_length=500, blank=True, null=True)
	analisis_rp = models.CharField(max_length=200, blank=True, null=True) #ID DE ANALISIS ASOCIADO
	documentos_rp = ListaField()
	richPFinal_rp = models.CharField(max_length=200, blank=True, null=True)
	comments_rp = ListaField()
	created_by = models.CharField(max_length=200, blank=False, null=False)
	date_rp = models.DateTimeField(auto_now_add=True, blank=False)

	def returnAnalisis(self):
		try:
			analisisID = self.analisis_rp
			analisis = Analisis.objects.get(id=analisisID)
			return analisis
		except:
			return None

	def returnRichPictureFinal(self):
		try:
			richPictureID = self.richPFinal_rp
			RP = DocumentoAnalisis.objects.get(id=richPictureID)
			return RP
		except:
			return None

	def returnComments(self):
		try:
			ComentariosID = self.comments_rp
			comentariosRP = []
			for c in ComentariosID:
				cRP = Comentario.objects.get(id=c)
				comentariosRP.append(cRP)
			return comentariosRP
		except:
			return None

	def returnDocumentos(self):
		try:
			documentosID = self.documentos_rp
			documentos = []
			for d in documentosID:
				D = DocumentoAnalisis.objects.get(id=d)
				documentos.append(D)
			return documentos
		except:
			return None
