from django.contrib import admin
from myapp.modulos.comunicacion.models import Notificacion
def notificaciones(instance):
    return ', '.join(str(instance.users_noRead_notificacion))
 
class NotificacionAdmin(admin.ModelAdmin):
    list_display = ['users_noRead_notificacion', notificaciones]
admin.site.register(Notificacion, NotificacionAdmin)
# Register your models here.
