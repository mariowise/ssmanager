from django.contrib import admin
from myapp.modulos.estado_1.models import Media, Etiqueta, Comentario
# Register your models here.
def medias(instance):
    return ', '.join(str(instance.comments_media))
 
class MediaAdmin(admin.ModelAdmin):
    list_display = ['comments_media', medias]
    

admin.site.register(Media, MediaAdmin)
admin.site.register(Comentario)
admin.site.register(Etiqueta)
