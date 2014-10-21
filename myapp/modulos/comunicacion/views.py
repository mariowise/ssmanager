from django.shortcuts import render, redirect
from django.http import HttpResponseRedirect, HttpResponse
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator, EmptyPage, InvalidPage
from django.core import serializers

from myapp.modulos.comunicacion.forms import mensajeForm
from myapp.modulos.comunicacion.models import Mensaje, Notificacion
from myapp.modulos.comunicacion.functions import eliminarNotificacion
from myapp.modulos.principal.models import userProfile, userSoftSystemProject
from myapp.modulos.principal.functions import members_only
from myapp.modulos.estado_1.models import Media, Analisis
from myapp.modulos.estado_2.models import RichPicture
from myapp.modulos.estado_3.models import DefinicionRaizCATWOE

# Create your views here.
@login_required(login_url='/login/')
def enviarMensaje_view(request, id_ssp):
	if members_only(id_ssp, request):
		receptores_mensaje = request.POST.getlist('e9')
		if receptores_mensaje:
			if request.method =="POST":
				form = mensajeForm(request.POST)
				if form.is_valid():
					proyecto_mensaje = id_ssp
					remitente_mensaje = request.user.get_username()
					asunto_mensaje = form.cleaned_data['asunto_mensaje']
					contenido_mensaje = form.cleaned_data['contenido_mensaje']
					newMensaje = Mensaje.objects.create(remitente_mensaje=remitente_mensaje, asunto_mensaje=asunto_mensaje, contenido_mensaje=contenido_mensaje, proyecto_mensaje=proyecto_mensaje)

					for r in receptores_mensaje:
						newMensaje.receptores_mensaje.append(r)

					newMensaje.save()

					receptores = newMensaje.receptores_mensaje
					for r in receptores:
						U = User.objects.get(id=r)
						Up = userProfile.objects.get(user=U)
						Up.mensajes_user_noleidos.append(newMensaje.id)
						U.save()
						Up.save()
					return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
		return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
	else:
		return render(request, 'comunicacion/error.html')

@login_required(login_url='/login/')
def verMensajes_view(request, page):
	usuario = User.objects.get(username__exact=request.user.get_username())
	profileUsuario = userProfile.objects.get(user=usuario)
	mensajesNoLeidos = profileUsuario.returnMensajesNoLeidos()
	paginatorNoLeidos = Paginator(mensajesNoLeidos, 5)
	mensajesLeidos = profileUsuario.returnMensajesLeidos()
	paginatorLeidos = Paginator(mensajesLeidos, 5)

	try:
		pagina = int(page)
	except:
		page = 1
	try:
		list_Noleidos = paginatorNoLeidos.page(pagina)
		list_Leidos = paginatorLeidos.page(pagina)
	except (EmptyPage, InvalidPage):
		list_Noleidos = paginatorNoLeidos.page(paginatorNoLeidos.num_pages)
		list_Leidos = paginatorLeidos.page(paginatorLeidos.num_pages)

	ctx = {'mensajesLeidos' : list_Leidos, 'mensajesNoLeidos' : list_Noleidos}
	return render(request, 'comunicacion/mensajes.html', ctx)

	
@login_required(login_url='/login/')
def verMensaje_view(request, id_mensaje):
	mensaje = Mensaje.objects.get(id=id_mensaje)
	proyecto_mensaje = userSoftSystemProject.objects.get(id=mensaje.proyecto_mensaje)
	remitente = mensaje.returnRemitente()
	receptores = mensaje.returnReceptores()
	usuario = User.objects.get(username__exact=request.user.get_username())
	usuarioProfile = userProfile.objects.get(user=usuario)

	if mensaje.id in usuarioProfile.mensajes_user_noleidos:
		del usuarioProfile.mensajes_user_noleidos[usuarioProfile.mensajes_user_noleidos.index(mensaje.id)]
		usuarioProfile.mensajes_user_leidos.append(mensaje.id)

	usuarioProfile.save()
	ctx = {'mensaje' : mensaje, 'remitente' : remitente, 'receptores' : receptores, 'proyecto_mensaje' : proyecto_mensaje}
	return render(request, 'comunicacion/ver_mensaje.html', ctx)
			
@login_required(login_url='/login/')
def eliminarMensaje_view(request, id_mensaje):
	mensaje = Mensaje.objects.get(id=id_mensaje)
	usuarioProfile = userProfile.objects.get(user=request.user)

	if mensaje.id in usuarioProfile.mensajes_user_noleidos:
		del usuarioProfile.mensajes_user_noleidos[usuarioProfile.mensajes_user_noleidos.index(mensaje.id)]
		usuarioProfile.save()

	if mensaje.id in usuarioProfile.mensajes_user_leidos:
		del usuarioProfile.mensajes_user_leidos[usuarioProfile.mensajes_user_leidos.index(mensaje.id)]
		usuarioProfile.save()

	return HttpResponseRedirect(request.META.get('HTTP_REFERER'))

@login_required(login_url='/login/')
def notificacion_json_view(request, id_ssp):
	proyecto = userSoftSystemProject.objects.get(id=id_ssp)
	notificaciones = proyecto.returnNotificaciones()
	notificacionesUser = []
	
	for n in notificaciones:
		if request.user.id in n.users_noRead_notificacion:
			notificacionesUser.append(n)

	data = serializers.serialize("json", notificacionesUser)
	return HttpResponse(data, mimetype='application/json')

@login_required(login_url='/login/')
def notificacion_ver_view(request, id_noti, id_ssp):
	if members_only(id_ssp, request):
		notificacion = Notificacion.objects.get(id=id_noti)
		try:
			del notificacion.users_noRead_notificacion[notificacion.users_noRead_notificacion.index(request.user.id)]
			notificacion.save()
			return redirect(notificacion.url_notificacion)
		except:	
			if notificacion.type_notificacion == 'Media':
					try:
						m = Media.objects.get(id=notificacion.id_asoc_notificacion)
						return redirect(notificacion.url_notificacion)
					except:
						eliminarNotificacion(id_ssp, notificacion)
						return HttpResponseRedirect(request.META.get('HTTP_REFERER'))

			if notificacion.type_notificacion == 'RichPicture':
					try:
						r = RichPicture.objects.get(id=notificacion.id_asoc_notificacion)
						return redirect(notificacion.url_notificacion)
					except:
						eliminarNotificacion(id_ssp, notificacion)
						return HttpResponseRedirect(request.META.get('HTTP_REFERER'))

			if notificacion.type_notificacion == 'Analisis':
					try:
						a = Analisis.objects.get(id=notificacion.id_asoc_notificacion)
						return redirect(notificacion.url_notificacion)
					except:
						eliminarNotificacion(id_ssp, notificacion)
						return HttpResponseRedirect(request.META.get('HTTP_REFERER'))

			if notificacion.type_notificacion == 'DefinicionRaiz':
					try:
						d = DefinicionRaizCATWOE.objects.get(id=notificacion.id_asoc_notificacion)
						return redirect(notificacion.url_notificacion)
					except:
						eliminarNotificacion(id_ssp, notificacion)
						return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
	else:
		return render(request, 'comunicacion/error.html')			

			

		

@login_required(login_url='/login/')
def notificacion_all_view(request, id_ssp, page):
	if members_only(id_ssp, request):
		proyecto = userSoftSystemProject.objects.get(id=id_ssp)
		notificaciones = proyecto.returnNotificaciones()
		paginator = Paginator(notificaciones, 15)
		destinatarios = proyecto.returnAllusers(request.user.get_username())

		try:
			pagina = int(page)
		except:
			page = 1
		try:
			list_notificaciones = paginator.page(pagina)
			
		except (EmptyPage, InvalidPage):
			list_notificaciones = paginator.page(paginator.num_pages)
			

		ctx = {'proyecto' : proyecto, 'notificaciones' : list_notificaciones, 'destinatarios' : destinatarios}
		return render(request, 'comunicacion/notificaciones.html', ctx)
	else:
		return render(request, 'comunicacion/error.html')