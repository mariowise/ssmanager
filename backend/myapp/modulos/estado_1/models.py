from django.db import models
from django.contrib.auth.models import User
from myapp.modulos.principal.models import userSoftSystemProject, ListaField


# Create your models here.


class Comentario(models.Model):
	autor_comentary = models.ForeignKey(User)
	date_comentary = models.DateTimeField(auto_now_add=True, blank=False)
	content_comentary = models.TextField(max_length=500, blank=False, null=False)

class Media(models.Model):
	name_media = models.CharField(max_length=200, blank=False, null=False)
	description_media = models.TextField(max_length=500, blank=False, null=False)
	url_media = models.URLField(blank=False, null=False)
	comments_media = ListaField()
	tags_media = ListaField()
	uploaded_by = models.CharField(max_length=200, blank=False, null=False)
	date_media = models.DateTimeField(auto_now_add=True, blank=False)
	type_media = models.CharField(max_length=200, blank=False, null=False)
	
	def __unicode__(self):
		return self.name_media	

	def returnComments(self):
		try:
			ComentariosID = self.comments_media
			comentariosMedia = []
			for c in ComentariosID:
				cV = Comentario.objects.get(id=c)
				comentariosMedia.append(cV)
			return comentariosMedia
		except:
			return None

	def returnTags(self):
		try:
			tagsID = self.tags_media
			tagMedia = []
			for t in tagsID:
				tV = Etiqueta.objects.get(id=t)
				tagMedia.append(tV)
			return tagMedia
		except:
			return None

class DocumentoAnalisis(models.Model):
	name_documento = models.CharField(max_length=200, blank=False, null=False)
	url_documento = models.URLField(blank=False, null=False)
	shared_documento = models.CharField(max_length=200, blank=False, null=False)
	date_documento = models.DateTimeField(auto_now_add=True, blank=False)


class Etiqueta(models.Model):
	name_tag = models.CharField(max_length=200, blank=False, null=False)
	description_tag = models.TextField(max_length=500, blank=False, null=False)

	def __unicode__(self):
		return self.name_tag

class StateOne(models.Model):
	ssp_stateOne = models.OneToOneField(userSoftSystemProject)
	ssp_videos = ListaField()
	ssp_imagenes = ListaField()
	ssp_audios = ListaField()
	ssp_documentos = ListaField()
	ssp_analisis = ListaField()
	tags_state = ListaField()

	def returnTags(self):
		try:
			tagsID = self.tags_state
			tags = []
			for t in tagsID:
				tV = Etiqueta.objects.get(id=t)
				tags.append(tV)
			return tags
		except:
			return None

	def returnVideos(self):
		try:
			videosID = self.ssp_videos
			videos = []
			for v in reversed(videosID):
				V = Media.objects.get(id=v)
				videos.append(V)
			return videos
		except:
			return None

	def returnVideosbyTag(self, id_tag):
		try:
			videosID = self.ssp_videos
			videos = []
			tags = list(id_tag)
			for v in reversed(videosID):
				V = Media.objects.get(id=v)
				for t in V.tags_media:
					if t in tags and V not in videos:
						videos.append(V)
			return videos
		except:
			return None


	def returnImagenes(self):
		try:
			imagenesID = self.ssp_imagenes
			imagenes = []
			for i in reversed(imagenesID):
				I = Media.objects.get(id=i)
				imagenes.append(I)
			return imagenes
		except:
			return None

	def returnImagenesbyTag(self, id_tag):
		try:
			imagenesID = self.ssp_imagenes
			imagenes = []
			tags = list(id_tag)
			for v in reversed(imagenesID):
				V = Media.objects.get(id=v)
				for t in V.tags_media:
					if t in tags and V not in imagenes:
						imagenes.append(V)
			return imagenes
		except:
			return None

	def returnAudios(self):
		try:
			audiosID = self.ssp_audios
			audios = []
			for a in reversed(audiosID):
				A = Media.objects.get(id=a)
				audios.append(A)
			return audios
		except:
			return None

	def returnAudiosbyTag(self, id_tag):
		try:
			audiosID = self.ssp_audios
			audios = []
			tags = list(id_tag)
			for v in reversed(audiosID):
				V = Media.objects.get(id=v)
				for t in V.tags_media:
					if t in tags and V not in audios:
						audios.append(V)
			return audios
		except:
			return None

	def returnDocumentos(self):
		try:
			documentosID = self.ssp_documentos
			documentos = []
			for d in reversed(documentosID):
				D = Media.objects.get(id=d)
				documentos.append(D)
			return documentos
		except:
			return None

	def returnDocumentosbyTag(self, id_tag):
		try:
			documentosID = self.ssp_documentos
			documentos = []
			tags = list(id_tag)
			for v in reversed(documentosID):
				V = Media.objects.get(id=v)
				for t in V.tags_media:
					if t in tags and V not in documentos:
						documentos.append(V)
			return documentos
		except:
			return None

	def returnAnalisis(self):
		try:
			analisisID = self.ssp_analisis
			analisis = []
			for a in reversed(analisisID):
				A = Analisis.objects.get(id=a)
				analisis.append(A)
			return analisis
		except:
			return None

class Analisis(models.Model):
	name_analisis = models.CharField(max_length=200, blank=False, null=False)
	description_analisis = models.TextField(max_length=500, blank=True, null=True)
	links_analisis = ListaField()
	comments_analisis = ListaField()
	tags_analisis = ListaField()
	created_by = models.CharField(max_length=200, blank=False, null=False)
	date_analisis = models.DateTimeField(auto_now_add=True, blank=False)

	def __unicode__(self):
		return self.name_analisis	

	def returnDocuments(self):
		try:
			documentsID = self.links_analisis
			documentsAnalisis = []
			for c in reversed(documentsID):
				cV = DocumentoAnalisis.objects.get(id=c)
				documentsAnalisis.append(cV)
			return documentsAnalisis
		except:
			return None

	def returnComments(self):
		try:
			ComentariosID = self.comments_analisis
			comentariosAnalisis = []
			for c in ComentariosID:
				cV = Comentario.objects.get(id=c)
				comentariosAnalisis.append(cV)
			return comentariosAnalisis
		except:
			return None

	def returnTags(self):
		tags = []
		for tid in self.tags_analisis:
			try:
				tags.append(Etiqueta.objects.get(id=tid))
			except:
				pass
		return tags

		# try:
		# 	tagsID = self.tags_analisis
		# 	tagAnalisis = []
		# 	for t in tagsID:
		# 		tV = Etiqueta.objects.get(id=t)
		# 		tagAnalisis.append(tV)
		# 	return tagAnalisis
		# except:
		# 	return None
