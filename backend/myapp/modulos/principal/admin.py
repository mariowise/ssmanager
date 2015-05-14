from django.contrib import admin
from myapp.modulos.principal.models import userProfile
from myapp.modulos.principal.models import userSoftSystemProject

def contribs_ssp(instance):
    return ', '.join(instance.contribs_ssp)
 
class userSoftSystemProjectAdmin(admin.ModelAdmin):
    list_display = ['name_ssp', contribs_ssp]

def project_colab_user(instance):
    return ', '.join(instance.project_colab_user)
 
class userProfileAdmin(admin.ModelAdmin):
    list_display = ['user', project_colab_user]

admin.site.register(userProfile, userProfileAdmin)
admin.site.register(userSoftSystemProject, userSoftSystemProjectAdmin)