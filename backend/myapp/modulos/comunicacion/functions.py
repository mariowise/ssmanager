from myapp.modulos.comunicacion.models import Notificacion, Mensaje
from myapp.modulos.principal.models import userSoftSystemProject
from django.contrib.auth.models import User
from myapp.modulos.principal.models import userProfile

from google.appengine.api import mail


def notificar(id_ssp, id_user, url, accion, id_asoc, type_):
	proyecto = userSoftSystemProject.objects.get(id=id_ssp)
	if not proyecto.contribs_ssp:
		pass
	else:
		user = User.objects.get(id=id_user)
		UserProfile = userProfile.objects.get(user=user)
		newNotificacion = Notificacion.objects.create(creador_notificacion=user.get_username(),
			imagen_notificacion=UserProfile.photo_user, accion_notificacion=accion, 
			url_notificacion=url, id_asoc_notificacion=id_asoc, type_notificacion=type_)
		destinatarios = proyecto.returnAllusers(user.get_username())

		for d in destinatarios:
			newNotificacion.users_noRead_notificacion.append(d.id)
			dProfile = userProfile.objects.get(user=d)
			if d == proyecto.manager:
				if dProfile.mWeb_user == True:
					notificarWeb(d, id_ssp, id_user, accion, url)
				if dProfile.mEmail_user == True:
					notificarEmail(d, id_ssp, id_user, accion, url)
			else:
				if dProfile.cWeb_user == True:
					notificarWeb(d, id_ssp, id_user, accion, url)
				if dProfile.cEmail_user == True:
					notificarEmail(d, id_ssp, id_user, accion, url)


		newNotificacion.save()
		proyecto.notificaciones_ssp.append(newNotificacion.id)
		proyecto.save()

def eliminarNotificacion(id_ssp, notificacion):
	proyecto = userSoftSystemProject.objects.get(id=id_ssp)
	del proyecto.notificaciones_ssp[proyecto.notificaciones_ssp.index(notificacion.id)]
	proyecto.save()
	notificacion.delete()

def notificarWeb(user, id_ssp, id_user, accion, url):

	remitente = User.objects.get(id=id_user)
	proyecto_mensaje = id_ssp
	remitente_mensaje = remitente.get_username()
	asunto_mensaje = 'Notificacion'
	contenido_mensaje = '%s %s'%(remitente_mensaje, accion)
	newMensaje = Mensaje.objects.create(remitente_mensaje=remitente_mensaje, asunto_mensaje=asunto_mensaje, contenido_mensaje=contenido_mensaje, proyecto_mensaje=proyecto_mensaje, url_asoc_mensaje=url)
	newMensaje.receptores_mensaje.append(user.id)
	newMensaje.save()
	profile = userProfile.objects.get(user=user)
	profile.mensajes_user_noleidos.append(newMensaje.id)
	profile.save()

def notificarEmail(user, id_ssp, id_user, accion, url):
	
	userA = User.objects.get(id=id_user)
	proyecto = userSoftSystemProject.objects.get(id=id_ssp)
	message = mail.EmailMessage(sender="Soft System Manager <arden.papifunk@gmail.com>",
		subject="Notificacion")

	message.to = user.email
	message.html = """
	<html><head></head><body>
	Estimado:

	Te informamos que %s %s en el proyecto %s , puedes ver el contenido en esta direccion:

	<a href="http://softsystemanager.appspot.com%s">Ver notificacion en su contexto</a>

	Saludos	!!!!
	</body></html>
	"""%(userA.get_username(), accion, proyecto.name_ssp ,url)


	message.send()

