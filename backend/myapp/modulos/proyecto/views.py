from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.http import HttpResponseRedirect

from myapp.modulos.principal.models import userSoftSystemProject, userProfile
from myapp.modulos.principal.functions import members_only
from myapp.modulos.comunicacion.functions import notificarEmail
from myapp.modulos.comunicacion.models import Mensaje

from myapp.modulos.principal.models import CredentialsModel
from oauth2client.django_orm import Storage
from apiclient.discovery import build
import httplib2
# Create your views here.
@login_required(login_url='/login/')
def contrib_view(request, id_ssp):
	if members_only(id_ssp, request):
		proyecto = userSoftSystemProject.objects.get(id=id_ssp)
		destinatarios = proyecto.returnAllusers(request.user.get_username())
		usuarios = User.objects.filter(is_staff=False, is_active=True)
		ctx = {}
		usersObj = []
		status = ""
		if request.method == "POST":
			nameContrib = request.POST['e14']
			try:
				user = User.objects.get(username__exact=nameContrib)
			except:		
				status = "0"
				usersObj = proyecto.contribUsers()	
				ctx = {'proyecto':proyecto, 'status': status, 'usuarios' : usersObj , 
						'destinatarios' : destinatarios, 'usuariosSSM' : usuarios}
				return render(request, 'proyecto/add_colaborador.html', ctx)

			if user.get_username() in proyecto.contribs_ssp or proyecto.manager.get_username() == nameContrib:		
				status = "2"
				usersObj = proyecto.contribUsers()	
				ctx = {'proyecto':proyecto, 'status': status, 'usuarios' : usersObj, 
						'destinatarios' : destinatarios, 'usuariosSSM' : usuarios}
				return render(request, 'proyecto/add_colaborador.html', ctx)
			else:
				usersObj = proyecto.contribUsers()	
				status = "1"
				ctx = {'proyecto':proyecto, 'status': status, 'usuarios' : usersObj, 
						'destinatarios' : destinatarios, 'usuariosSSM' : usuarios}

				newMensaje = Mensaje.objects.create(remitente_mensaje=request.user.get_username(), asunto_mensaje='Invitacion', contenido_mensaje='%s te ha invitado a que colabores en su proyecto %s'%(request.user.get_username(), proyecto.name_ssp), proyecto_mensaje=proyecto.id, url_asoc_mensaje='/aceptarInvitacion/%s/%s'%(id_ssp, user.id))
				newMensaje.receptores_mensaje.append(user.id)
				newMensaje.save()
				Up = userProfile.objects.get(user=user)
				Up.mensajes_user_noleidos.append(newMensaje.id)
				Up.save()

				try:
					notificarEmail(user, id_ssp, request.user.id, 'quiere que colabores', '/principal')
				except:
					pass
				return render(request, 'proyecto/add_colaborador.html', ctx)

		usersObj = proyecto.contribUsers()	
		ctx = {'proyecto':proyecto, 'usuarios' : usersObj, 
				'destinatarios' : destinatarios, 'usuariosSSM' : usuarios}
		return render(request, 'proyecto/add_colaborador.html', ctx)
	else:
		return render(request, 'comunicacion/error.html')

@login_required(login_url='/login/')
def profile_view(request, id_ssp, id_user):
	user = User.objects.get(id=id_user)
	proyecto = userSoftSystemProject.objects.get(id=id_ssp)
	ctx = {'usuario' : user, 'proyecto': proyecto}
	return render(request, 'proyecto/profile.html', ctx)

@login_required(login_url='/login/')
def desvincularColaborador_view(request, id_ssp, id_user):
	if members_only(id_ssp, request):
		proyecto = userSoftSystemProject.objects.get(id=id_ssp)
		usuario = User.objects.get(id=id_user)
		usuarioProfile = userProfile.objects.get(user=usuario)
		nombreUser = usuario.get_username()
		del proyecto.contribs_ssp[proyecto.contribs_ssp.index(nombreUser)]
		del usuarioProfile.project_colab_user[usuarioProfile.project_colab_user.index(proyecto.id)]

		foldersDriveIDs = list(usuarioProfile.id_folder_user)

		for ID in foldersDriveIDs:
			if ID in proyecto.ids_folder_ssp:
				del proyecto.ids_folder_ssp[proyecto.ids_folder_ssp.index(ID)]
				del usuarioProfile.id_folder_user[usuarioProfile.id_folder_user.index(ID)]

		usuarioProfile.save()
		proyecto.save()
		return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
	else:
		return render(request, 'comunicacion/error.html')

@login_required(login_url='/login/')
def invitacion_view(request, id_ssp, id_user, id_mensaje):
	proyecto = userSoftSystemProject.objects.get(id=id_ssp)
	user = User.objects.get(id=id_user)
	mensaje = Mensaje.objects.get(id=id_mensaje)

	try:
		storage = Storage(CredentialsModel, 'id_user', request.user, 'credential')
		credential = storage.get()
		http = httplib2.Http()
		http = credential.authorize(http)
		drive_service = build('drive', 'v2', http=http, developerKey="hbP6_4UJIKe-m74yLd8tQDfT")
	except:
		return redirect('vista_logout')

	contribP = userProfile.objects.get(user=user)
	if proyecto.id not in contribP.project_colab_user:
		contribP.project_colab_user.append(proyecto.id)
		proyecto.contribs_ssp.append(user.get_username())

		body = {
	      'title': '%s'%(proyecto.name_ssp),
	      'mimeType': "application/vnd.google-apps.folder",
	      'parents' : [{'id' : contribP.id_drive_folder}]
	    }

		folder = drive_service.files().insert(body = body).execute()
		folderID = folder.get('id')
		proyecto.ids_folder_ssp.append(folderID)
		contribP.id_folder_user.append(folderID)
		proyecto.save()
		contribP.save()

	#ACA VA EL CODIGO PARA CREAR LAS CARPETAS CORRESPONDIENTES EN DRIVE

	if mensaje.id in contribP.mensajes_user_noleidos:
		del contribP.mensajes_user_noleidos[contribP.mensajes_user_noleidos.index(mensaje.id)]
		contribP.save()

	if mensaje.id in contribP.mensajes_user_leidos:
		del contribP.mensajes_user_leidos[contribP.mensajes_user_leidos.index(mensaje.id)]
		contribP.save()

	mensaje.delete()
	return redirect('/project/%s'%(proyecto.id))


