from django.db import models
from django.contrib.auth.models import User
from djangotoolbox.fields import ListField
from myapp.modulos.principal.forms import StringListField
from myapp.modulos.comunicacion.models import Mensaje, Notificacion
# Create your models here.

from django.contrib import admin
from oauth2client.django_orm import CredentialsField
from myapp import settings

class ListaField(ListField):
    def formfield(self, **kwargs):
        return models.Field.formfield(self, StringListField, **kwargs)



class CredentialsModel(models.Model):
  id_user = models.ForeignKey(User, unique=True)
  credential = CredentialsField()


class CredentialsAdmin(admin.ModelAdmin):
    pass


admin.site.register(CredentialsModel, CredentialsAdmin)



class userProfile(models.Model):

	def url(self, filename):
		url = "MultimediaData/Users/Profile_img/%s/%s"%(self.user.username, filename)
		return url
		
	user = models.OneToOneField(User)
	email_public_user = models.EmailField(blank=True, null=True)
	url_user = models.URLField(max_length=200, blank=True, null=True)
	company_user = models.CharField(max_length=200, blank=True, null=True)
	position_user = models.CharField(max_length=200, blank=True, null=True)
	mWeb_user = models.NullBooleanField()
	mEmail_user = models.NullBooleanField()
	cWeb_user = models.NullBooleanField()
	cEmail_user = models.NullBooleanField()
	photo_user = models.ImageField(upload_to=url, default='MultimediaData/Users/Profile_img/prueba/img1.png')
	project_colab_user = ListaField()#Guardar ID's de los proyectos en los que colaboro
	id_folder_user = ListaField()#Guardar las ID's de las carpetas en drive que colabora
	mensajes_user_leidos = ListaField()
	mensajes_user_noleidos = ListaField()
	id_drive_folder = models.CharField(max_length=200, blank=True, null=True)

	def __unicode__(self):
		return self.user.username	

	def contribProjects(self):
		proyectosId = self.project_colab_user
		proyectosContrib = []
		for ID in reversed(proyectosId):
			pC = userSoftSystemProject.objects.get(id=ID)
			proyectosContrib.append(pC)
		return proyectosContrib

	def returnMensajesLeidos(self):
		allMessagesID = self.mensajes_user_leidos
		messages = []
		for m in reversed(allMessagesID):
			M =  Mensaje.objects.get(id=m)
			messages.append(M)
		return messages

	def returnMensajesNoLeidos(self):
		allMessagesID = self.mensajes_user_noleidos
		messages = []
		for m in reversed(allMessagesID):
			M =  Mensaje.objects.get(id=m)
			messages.append(M)
		return messages

class userSoftSystemProject(models.Model):

	manager = models.ForeignKey(User)
	name_ssp = models.CharField(max_length=50, blank=False, null=False)
	description_ssp = models.TextField(max_length=500, blank=False, null=False)
	date_spp = models.DateTimeField(auto_now_add=True, blank=False)
	contribs_ssp = ListaField()
	notificaciones_ssp = ListaField()
	id_folder_ssp = models.CharField(max_length=50, blank=True, null=True)#ID de la carpeta del manager
	ids_folder_ssp = ListaField()

	def __unicode__(self):
		return self.name_ssp

	def returnNotificaciones(self):
		try:
			notificacionesID = self.notificaciones_ssp
			notificaciones = []
			for n in reversed(notificacionesID):
				N = Notificacion.objects.get(id=n)
				notificaciones.append(N)
			return notificaciones
		except:
			return None

	def returnAllusers(self, username):

		manager = self.manager
		Names = list(self.contribs_ssp)
		if username in Names:
			del Names[Names.index(username)]

		Users = []
		for N in Names:
			U = User.objects.get(username__exact=N)
			Users.append(U)
		if not manager.get_username() == username:
			Users.append(manager)
		return Users

	def contribUsers(self):
		contribNames = self.contribs_ssp
		contribUsers = []
		for cN in contribNames:
			cU = User.objects.get(username__exact=cN)
			contribUsers.append(cU)
		return contribUsers