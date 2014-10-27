from django.shortcuts import render, redirect
from django.http import HttpResponseRedirect
from django.core.paginator import Paginator, EmptyPage, InvalidPage
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User

from myapp.modulos.principal.models import userSoftSystemProject, userProfile
from myapp.modulos.principal.functions import members_only
from myapp.modulos.estado_1.models import DocumentoAnalisis, StateOne, Comentario
from myapp.modulos.estado_1.forms import resumenAnalisisForm, comentaryForm
from myapp.modulos.estado_2.models import StateTwo, RichPicture
from myapp.modulos.estado_2.forms import nombreRichPictureForm
from myapp.modulos.comunicacion.functions import notificar
from myapp.modulos.principal.models import CredentialsModel
from myapp import settings

from oauth2client import xsrfutil
from oauth2client.client import flow_from_clientsecrets
from oauth2client.django_orm import Storage
from apiclient.discovery import build
import httplib2
import os



CLIENT_SECRETS = os.path.join(os.path.dirname(__file__), 'client_secrets.json')
FLOW = flow_from_clientsecrets(
    CLIENT_SECRETS,
    scope='https://www.googleapis.com/auth/drive',
    redirect_uri=settings.REDIRECT_URI)


# Create your views here.
@login_required(login_url='/login/')
def general_dos_view(request, id_ssp):
	if members_only(id_ssp, request):
		proyecto = userSoftSystemProject.objects.get(id=id_ssp)
		stateTwo = StateTwo.objects.get(ssp_stateTwo=proyecto)
		richPictures = stateTwo.returnRichPictures()[:5]
		destinatarios = proyecto.returnAllusers(request.user.get_username())

		ctx = {'proyecto' : proyecto, 'destinatarios' : destinatarios, 'richPictures' : richPictures}
		return render(request, 'estado_dos/estado_dos_general.html', ctx)
	else:
		return render(request, 'comunicacion/error.html')

@login_required(login_url='/login/')
def richPictures_view(request, id_ssp, page):
	if members_only(id_ssp, request):
		proyecto = userSoftSystemProject.objects.get(id=id_ssp)
		stateTwo = StateTwo.objects.get(ssp_stateTwo=proyecto)
		richPictures = stateTwo.returnRichPictures()
		destinatarios = proyecto.returnAllusers(request.user.get_username())

		paginator = Paginator(richPictures, 5)
		try:
			pagina = int(page)
		except:
			page = 1
		try:
			list_richPictures = paginator.page(pagina)
		except (EmptyPage, InvalidPage):
			list_richPictures = paginator.page(paginator.num_pages)

		ctx = {'proyecto' : proyecto, 'destinatarios' : destinatarios, 'richPictures' : list_richPictures}
		return render(request, 'estado_dos/estado_dos_richpictures.html', ctx)
	else:
		return render(request, 'comunicacion/error.html')

@login_required(login_url='/login/')
def richPicture_crear_view(request, id_ssp):
	if members_only(id_ssp, request):
		if request.method == "POST":
			form = nombreRichPictureForm(request.POST)
			if form.is_valid():
				name_rp = form.cleaned_data['name_rp']
				newRP = RichPicture.objects.create(name_rp=name_rp, created_by=request.user.get_username())
				newRP.save()

				proyecto = userSoftSystemProject.objects.get(id=id_ssp)
				stateTwo = StateTwo.objects.get(ssp_stateTwo=proyecto)
				stateTwo.ssp_richPictures.append(newRP.id)
				stateTwo.save()
				
				notificar(id_ssp, request.user.id, '/verRichPicture/%s/%s'%(id_ssp,newRP.id), 'Agrego un nuevo Rich Picture', newRP.id, 'RichPicture')

				return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
			return HttpResponseRedirect(request.META.get('HTTP_REFERER'))

	else:
		return render(request, 'comunicacion/error.html')

@login_required(login_url='/login/')
def richPicture_eliminar_view(request, id_ssp, id_rp):
	if members_only(id_ssp, request):
		proyecto = userSoftSystemProject.objects.get(id=id_ssp)
		stateTwo = StateTwo.objects.get(ssp_stateTwo=proyecto)
		richpicture = RichPicture.objects.get(id=id_rp)
		comentariosRichPicture = richpicture.returnComments()
		documentosRichPicture = richpicture.returnDocumentos()

		for c in comentariosRichPicture:
			c.delete()
		
		for d in documentosRichPicture:
			d.delete()

		del stateTwo.ssp_richPictures[stateTwo.ssp_richPictures.index(richpicture.id)]

		stateTwo.save()
		richpicture.delete()
		return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
	else:
		return render(request, 'comunicacion/error.html')

@login_required(login_url='/login/')
def richPicture_desarrollo_view(request, id_ssp, id_rp):
	if members_only(id_ssp, request):
		proyecto = userSoftSystemProject.objects.get(id=id_ssp)
		destinatarios = proyecto.returnAllusers(request.user.get_username())
		richPicture = RichPicture.objects.get(id=id_rp)
		drawRichPictures = richPicture.returnDocumentos()
		stateOne = StateOne.objects.get(ssp_stateOne=proyecto)
		analisis = stateOne.returnAnalisis()
		analisisRP = richPicture.returnAnalisis()
		RPFinal = richPicture.returnRichPictureFinal()
		resumenForm = resumenAnalisisForm(initial={
						'description_analisis' : richPicture.description_rp,
			})
		ctx={'proyecto' : proyecto, 'richPicture' : richPicture, 'destinatarios' : destinatarios, 'drawRichPictures' : drawRichPictures, 'resumenForm' : resumenForm, 'analisis' : analisis, 'analisisRP' : analisisRP, 'RPFinal' : RPFinal}
		return render(request, 'estado_dos/estado_dos_desarrollo.html', ctx)
	else:
		return render(request, 'comunicacion/error.html')

@login_required(login_url='/login/')
def richPicture_eliminarDocumento_view(request, id_ssp, id_rp, id_documento):
	if members_only(id_ssp, request):
		documento = DocumentoAnalisis.objects.get(id=id_documento)
		richPicture = RichPicture.objects.get(id=id_rp)

		del richPicture.documentos_rp[richPicture.documentos_rp.index(documento.id)]
		if richPicture.richPFinal_rp == documento.id:
			richPicture.richPFinal_rp = None
		richPicture.save()

		documento.delete()
		return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
	else:
		return render(request, 'comunicacion/error.html')
	
@login_required(login_url='/login/')
def resumen_richPicture_view(request, id_rp):
	if request.method == "POST":
		form = resumenAnalisisForm(request.POST)
		if form.is_valid():
			resumen = form.cleaned_data['description_analisis']
			richPicture = RichPicture.objects.get(id=id_rp)
			richPicture.description_rp = resumen
			richPicture.save()
			return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
		return HttpResponseRedirect(request.META.get('HTTP_REFERER'))

	
@login_required(login_url='/login/')
def richPicture_newDocumento_view(request, id_ssp,id_rp):
	if request.method == "POST":
		form = nombreRichPictureForm(request.POST)
		if form.is_valid():
			storage = Storage(CredentialsModel, 'id_user', request.user, 'credential')
			credential = storage.get()
			if credential is None or credential.invalid:
				FLOW.params['state'] = xsrfutil.generate_token(settings.SECRET_KEY,request.user)
				authorize_url = FLOW.step1_get_authorize_url()
				return HttpResponseRedirect(authorize_url)
			else:
				proyecto = userSoftSystemProject.objects.get(id=id_ssp)
				name_documento = form.cleaned_data['name_rp']

				try:
					storage = Storage(CredentialsModel, 'id_user', request.user, 'credential')
					credential = storage.get()
					http = httplib2.Http()
					http = credential.authorize(http)
					drive_service = build('drive', 'v2', http=http, developerKey="hbP6_4UJIKe-m74yLd8tQDfT")
				except:
					return redirect('vista_logout')


				if request.user == proyecto.manager:
					body = {
					  'title': '%s'%(name_documento),
					  'description': 'Documento nuevo de %s'%(proyecto.name_ssp),
					  'mimeType': 'application/vnd.google-apps.drawing',
					  'parents' : [{'id' : proyecto.id_folder_ssp}]
					}
					try:
						file = drive_service.files().insert(body=body).execute()
					except:
						body = {
						  'title': '%s'%(name_documento),
						  'description': 'Documento nuevo de %s'%(proyecto.name_ssp),
						  'mimeType': 'application/vnd.google-apps.drawing',
						}
						try:
							file = drive_service.files().insert(body=body).execute()
						except:
							return render(request, 'comunicacion/error.html')

				else:

					userP = userProfile.objects.get(user=request.user)
					ID_final = ''
					for ID in userP.id_folder_user:
						if ID in proyecto.ids_folder_ssp:
							ID_final = ID
					body = {
					  'title': '%s'%(name_documento),
					  'description': 'Documento nuevo de %s'%(proyecto.name_ssp),
					  'mimeType': 'application/vnd.google-apps.drawing',
					  'parents' : [{'id' : ID_final}]
					}
					try:
						file = drive_service.files().insert(body=body).execute()
					except:
						
						body = {
						  'title': '%s'%(name_documento),
						  'description': 'Documento nuevo de %s'%(proyecto.name_ssp),
						  'mimeType': 'application/vnd.google-apps.drawing',
						}
						try:
							file = drive_service.files().insert(body=body).execute()
						except:
							return render(request, 'comunicacion/error.html')
							


				url_documento = file.get('alternateLink')
				newDocumento = DocumentoAnalisis.objects.create(name_documento=name_documento, url_documento=url_documento, shared_documento=request.user.get_username())
				newDocumento.save()

				richPicture = RichPicture.objects.get(id=id_rp)
				richPicture.documentos_rp.append(newDocumento.id)
				richPicture.save()
				return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
		return HttpResponseRedirect(request.META.get('HTTP_REFERER'))



@login_required(login_url='/login/')
def richPicture_adjuntarAnalisis_view(request, id_rp):
	idAnalisis = request.POST['e11']
	richPicture = RichPicture.objects.get(id=id_rp)
	richPicture.analisis_rp = idAnalisis
	richPicture.save()
	return HttpResponseRedirect(request.META.get('HTTP_REFERER'))

@login_required(login_url='/login/')
def richPicture_adjuntarDraw_view(request, id_rp):
	idDraw = request.POST['e1']
	richPicture = RichPicture.objects.get(id=id_rp)
	richPicture.richPFinal_rp = idDraw
	richPicture.save()
	return HttpResponseRedirect(request.META.get('HTTP_REFERER'))

@login_required(login_url='/login/')
def richPicture_single_view(request, id_ssp,id_rp):
	if members_only(id_ssp, request):
		try:
			proyecto = userSoftSystemProject.objects.get(id=id_ssp)
			destinatarios = proyecto.returnAllusers(request.user.get_username())
			stateOne = StateOne.objects.get(ssp_stateOne=proyecto)
			richPicture = RichPicture.objects.get(id=id_rp)
			RPFinal = richPicture.returnRichPictureFinal()
			comentarios = richPicture.returnComments()


			try:
				analisis = richPicture.returnAnalisis()
				etiquetasAnalisis = analisis.returnTags()
				videos = stateOne.returnVideosbyTag(analisis.tags_analisis)
				imagenes = stateOne.returnImagenesbyTag(analisis.tags_analisis)
				audios = stateOne.returnAudiosbyTag(analisis.tags_analisis)
				documentos = stateOne.returnDocumentosbyTag(analisis.tags_analisis)
			except:
				analisis = None
				etiquetasAnalisis = None
				videos = None
				imagenes = None
				audios = None
				documentos = None

		
			ctx={'proyecto' : proyecto, 'destinatarios' :destinatarios, 'richPicture' : richPicture, 'RPFinal' : RPFinal, 'analisis' : analisis, 'etiquetasAnalisis' : etiquetasAnalisis, 'comentarios' : comentarios, 'videos' : videos, 'imagenes' : imagenes, 'audios' : audios, 'documentos' : documentos}
			return render(request, 'estado_dos/estado_dos_richpicture_single.html', ctx)
		except:
			return render(request, 'comunicacion/error.html')
	else:
		return render(request, 'comunicacion/error.html')
			

@login_required(login_url='/login/')
def comentar_richPicture_view(request, id_rp, id_ssp):
	if members_only(id_ssp, request):
		richPicture = RichPicture.objects.get(id=id_rp)
		user = User.objects.get(username__exact=request.user.get_username())
		form = comentaryForm()
		if request.method == "POST":
			form = comentaryForm(request.POST)
			if form.is_valid():
				comentario = form.cleaned_data['comentary']
				newComment = Comentario.objects.create(autor_comentary=user, content_comentary=comentario)
				newComment.save()
				richPicture.comments_rp.append(newComment.id)
				richPicture.save()
				notificar(id_ssp, request.user.id, '/verRichPicture/%s/%s'%(id_ssp, id_rp), 'Ha comentado un Rich Picture', id_rp, 'RichPicture')
				return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
			return HttpResponseRedirect(request.META.get('HTTP_REFERER'))

	else:
		return render(request, 'comunicacion/error.html')