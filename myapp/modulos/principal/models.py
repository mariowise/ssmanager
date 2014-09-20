from django.db import models
from django.contrib.auth.models import User
from djangotoolbox.fields import ListField
from myapp.modulos.principal.forms import StringListField
# Create your models here.

class projectField(ListField):
    def formfield(self, **kwargs):
        return models.Field.formfield(self, StringListField, **kwargs)

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
	photo_user = models.ImageField(upload_to=url)
	project_colab_user = projectField()#Guardar ID's de los proyectos en los que colaboro

	def __unicode__(self):
		return self.user.username	

	def contribProjects(self):
		proyectosId = self.project_colab_user
		proyectosContrib = []
		for ID in proyectosId:
			pC = userSoftSystemProject.objects.get(id=ID)
			proyectosContrib.append(pC)
		return proyectosContrib

class ContribField(ListField):
    def formfield(self, **kwargs):
        return models.Field.formfield(self, StringListField, **kwargs)

	

class userSoftSystemProject(models.Model):

	manager = models.ForeignKey(User)
	name_ssp = models.CharField(max_length=50, blank=False, null=False)
	description_ssp = models.TextField(max_length=500, blank=False, null=False)
	date_spp = models.DateTimeField(auto_now_add=True, blank=False)
	privacy_ssp = models.CharField(max_length=50)
	contribs_ssp = ContribField()
	

	def __unicode__(self):
		return self.name_ssp

	def contribUsers(self):
		contribNames = self.contribs_ssp
		contribUsers = []

		for cN in contribNames:
			cU = User.objects.get(username__exact=cN)
			contribUsers.append(cU)

		return contribUsers