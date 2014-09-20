from django.db import models
from django.contrib.auth.models import User
from djangotoolbox.fields import ListField
from myapp.modulos.principal.forms import StringListField
from myapp.modulos.principal.models import userSoftSystemProject


# Create your models here.
class Comentarios(ListField):
    def formfield(self, **kwargs):
        return models.Field.formfield(self, StringListField, **kwargs)

class Medias(ListField):
    def formfield(self, **kwargs):
        return models.Field.formfield(self, StringListField, **kwargs)

class Etiquetas(ListField):
    def formfield(self, **kwargs):
        return models.Field.formfield(self, StringListField, **kwargs)

class Comentario(models.Model):
	autor_comentary = models.ForeignKey(User)
	date_comentary = models.DateTimeField(auto_now_add=True, blank=False)
	content_comentary = models.TextField(max_length=500, blank=False, null=False)

class Media(models.Model):
	name_media = models.CharField(max_length=200, blank=False, null=False)
	description_media = models.TextField(max_length=500, blank=False, null=False)
	url_media = models.URLField(blank=False, null=False)
	comments_media = Comentarios()
	tags_media = Etiquetas()
	uploaded_by = models.CharField(max_length=200, blank=False, null=False)
	date_media = models.DateTimeField(auto_now_add=True, blank=False)
	type_media = models.CharField(max_length=200, blank=False, null=False)

	
	def __unicode__(self):
		return self.name_media	

	def returnComments(self):
		ComentariosID = self.comments_media
		comentariosMedia = []
		for c in ComentariosID:
			cV = Comentario.objects.get(id=c)
			comentariosMedia.append(cV)
		return comentariosMedia

	def returnTags(self):
		tagsID = self.tags_media
		tagMedia = []
		for t in tagsID:
			tV = Etiqueta.objects.get(id=t)
			tagMedia.append(tV)
		return tagMedia

class Etiqueta(models.Model):
	name_tag = models.CharField(max_length=200, blank=False, null=False)
	description_tag = models.TextField(max_length=500, blank=False, null=False)

	def __unicode__(self):
		return self.name_tag

class StateOne(models.Model):
	ssp_stateOne = models.OneToOneField(userSoftSystemProject)
	ssp_videos = Medias()
	ssp_imagenes = Medias()
	ssp_audios = Medias()
	ssp_documentos = Medias()
	ssp_analisis = Medias()
	tags_state = Etiquetas()

	def returnTags(self):
		tagsID = self.tags_state
		tags = []
		for t in tagsID:
			tV = Etiqueta.objects.get(id=t)
			tags.append(tV)
		return tags

	def returnVideos(self):
		videosID = self.ssp_videos
		videos = []
		for v in reversed(videosID):
			V = Media.objects.get(id=v)
			videos.append(V)
		return videos

	def returnImagenes(self):
		imagenesID = self.ssp_imagenes
		imagenes = []
		for i in reversed(imagenesID):
			I = Media.objects.get(id=i)
			imagenes.append(I)
		return imagenes

	def returnAudios(self):
		audiosID = self.ssp_audios
		audios = []
		for a in reversed(audiosID):
			A = Media.objects.get(id=a)
			audios.append(A)
		return audios

	def returnDocumentos(self):
		documentosID = self.ssp_documentos
		documentos = []
		for d in reversed(documentosID):
			D = Media.objects.get(id=d)
			documentos.append(D)
		return documentos

	def returnAnalisis(self):
		analisisID = self.ssp_analisis
		analisis = []
		for a in reversed(analisisID):
			A = Media.objects.get(id=a)
			analisis.append(A)
		return analisis
