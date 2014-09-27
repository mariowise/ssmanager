from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect
from django.core.paginator import Paginator, EmptyPage, InvalidPage

from myapp.modulos.principal.models import userSoftSystemProject
from myapp.modulos.estado_1.forms import mediaForm, comentaryForm, etiquetaForm, nombreAnalisisForm, documentoForm, resumenAnalisisForm
from myapp.modulos.estado_1.models import Media, StateOne, Comentario, Etiqueta, Analisis, DocumentoAnalisis
from myapp.modulos.estado_1.functions import video_id
# Create your views here.
@login_required(login_url='/login/')
def general_uno_view(request, id_ssp):
	project = userSoftSystemProject.objects.get(id=id_ssp)
	destinatarios = project.returnAllusers(request.user.get_username())
	stateOne = StateOne.objects.get(ssp_stateOne=project)
	videos = stateOne.returnVideos()[:5]
	imagenes = stateOne.returnImagenes()[:5]
	audios = stateOne.returnAudios()[:5]
	documentos = stateOne.returnDocumentos()[:5]
	analisis = stateOne.returnAnalisis()[:5]

	ctx = {'proyecto':project, 'videos' : videos, 'imagenes' : imagenes, 'audios' : audios, 'documentos' : documentos, 'analisis' : analisis, 'destinatarios' : destinatarios}
	return render (request, 'estado_uno/estado_uno_general.html', ctx)

@login_required(login_url='/login/')
def media_view(request, id_type, id_ssp, page):
	project = userSoftSystemProject.objects.get(id=id_ssp)
	destinatarios = project.returnAllusers(request.user.get_username())
	stateOne = StateOne.objects.get(ssp_stateOne=project)
	tipo_media = id_type
	title = ""

	if tipo_media == '1':
		videos = stateOne.returnVideos()
		paginator = Paginator(videos, 10)
		try:
			pagina = int(page)
		except:
			page = 1
		try:
			list_videos = paginator.page(pagina)
		except (EmptyPage, InvalidPage):
			list_videos = paginator.page(paginator.num_pages)

		title = "Videos"
		ctx = {'proyecto':project, 'media' : list_videos, 'tipo' : tipo_media, 'title' : title, 'destinatarios' : destinatarios}
		return render (request, 'estado_uno/estado_uno_medias.html', ctx)

	if tipo_media == '2':
		imagenes = stateOne.returnImagenes()
		paginator = Paginator(imagenes, 10)
		try:
			pagina = int(page)
		except:
			page = 1
		try:
			list_imagenes = paginator.page(pagina)
		except (EmptyPage, InvalidPage):
			list_imagenes = paginator.page(paginator.num_pages)
		title = "Imagenes"
		ctx = {'proyecto':project, 'media' : list_imagenes, 'tipo' : tipo_media, 'title' : title}
		return render (request, 'estado_uno/estado_uno_medias.html', ctx)
		

	if tipo_media == '3':
		audios = stateOne.returnAudios()
		paginator = Paginator(audios, 10)
		try:
			pagina = int(page)
		except:
			page = 1
		try:
			list_audios = paginator.page(pagina)
		except (EmptyPage, InvalidPage):
			list_audios = paginator.page(paginator.num_pages)
		title = "Audios"
		ctx = {'proyecto':project, 'media' : list_audios, 'tipo' : tipo_media, 'title' : title}
		return render (request, 'estado_uno/estado_uno_medias.html', ctx)

	if tipo_media == '4':
		documentos = stateOne.returnDocumentos()
		paginator = Paginator(documentos, 10)
		try:
			pagina = int(page)
		except:
			page = 1
		try:
			list_documentos = paginator.page(pagina)
		except (EmptyPage, InvalidPage):
			list_documentos = paginator.page(paginator.num_pages)
		title = "Documentos"
		ctx = {'proyecto':project, 'media' : list_documentos, 'tipo' : tipo_media, 'title' : title}
		return render (request, 'estado_uno/estado_uno_medias.html', ctx)
	
@login_required(login_url='/login/')
def media_agregar_view(request, id_ssp):
	project = userSoftSystemProject.objects.get(id=id_ssp)
	form = mediaForm()
	if request.method == "POST":
		form = mediaForm(request.POST)
		if form.is_valid():
			media_name = form.cleaned_data['media_name']
			media_description = form.cleaned_data['media_description']
			media_url = form.cleaned_data['media_url']
			media_type = form.cleaned_data['media_type']
			upload_by = request.user.get_username()
			newMedia = Media.objects.create(name_media=media_name, description_media=media_description, url_media=media_url, uploaded_by =upload_by, type_media=media_type)
			newMedia.save()
			stateOne = StateOne.objects.get(ssp_stateOne=project)

			if media_type == '1':
				stateOne.ssp_videos.append(newMedia.id)
			if media_type == '2':
				stateOne.ssp_imagenes.append(newMedia.id)
			if media_type == '3':
				stateOne.ssp_audios.append(newMedia.id)
			if media_type == '4':
				stateOne.ssp_documentos.append(newMedia.id)

			stateOne.save()

			return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
		return HttpResponseRedirect(request.META.get('HTTP_REFERER'))

@login_required(login_url='/login/')
def media_ver_view(request, id_ssp, id_media):
	project = userSoftSystemProject.objects.get(id=id_ssp)
	destinatarios = project.returnAllusers(request.user.get_username())
	estado = StateOne.objects.get(ssp_stateOne=project)
	etiquetas = estado.returnTags()

	media = Media.objects.get(id=id_media)
	comentarios = media.returnComments()
	etiquetasMedia = media.returnTags()

	formComentary = comentaryForm()
	formaTag = etiquetaForm()
	if media.type_media == '1':
		embed = video_id(media.url_media)
		if embed is None:
			embed = "NO"
		ctx={'proyecto' : project, 'media' : media, 'comentarios':comentarios, 'formComentary' : formComentary, 'etiquetas':etiquetas, 'etiquetasMedia' : etiquetasMedia, 'formaTag':formaTag, 'embed' : embed, 'destinatarios' : destinatarios}
		return render(request, 'estado_uno/estado_uno_media_single.html', ctx)
	else :
		ctx={'proyecto' : project, 'media' : media, 'comentarios':comentarios, 'formComentary' : formComentary, 'etiquetas':etiquetas, 'etiquetasMedia' : etiquetasMedia, 'formaTag':formaTag, 'destinatarios' : destinatarios}
		return render(request, 'estado_uno/estado_uno_media_single.html', ctx)

@login_required(login_url='/login/')
def eliminar_media_view(request, id_ssp, id_media):
	project = userSoftSystemProject.objects.get(id=id_ssp)
	estado = StateOne.objects.get(ssp_stateOne=project)
	media = Media.objects.get(id=id_media)
	comentarios = media.returnComments()

	for c in comentarios:
		c.delete()

	if media.type_media == '1':
		del estado.ssp_videos[estado.ssp_videos.index(media.id)]

	if media.type_media == '2':
		del estado.ssp_imagenes[estado.ssp_imagenes.index(media.id)]

	if media.type_media == '3':
		del estado.ssp_audios[estado.ssp_audios.index(media.id)]

	if media.type_media == '4':
		del estado.ssp_documentos[estado.ssp_documentos.index(media.id)]

	estado.save()
	media.delete()
	return HttpResponseRedirect(request.META.get('HTTP_REFERER'))

@login_required(login_url='/login/')
def comentar_media_view(request, id_media):
	media = Media.objects.get(id=id_media)
	user = User.objects.get(username__exact=request.user.get_username())
	form = comentaryForm()
	if request.method == "POST":
		form = comentaryForm(request.POST)
		if form.is_valid():
			comentario = form.cleaned_data['comentary']
			newComment = Comentario.objects.create(autor_comentary=user, content_comentary=comentario)
			newComment.save()
			media.comments_media.append(newComment.id)
			media.save()
			return HttpResponseRedirect(request.META.get('HTTP_REFERER'))

@login_required(login_url='/login/')
def etiquetar_media_view(request, id_media):
	tags = request.POST.getlist('e9')
	if tags:
		media = Media.objects.get(id=id_media)
		for t in tags:
			if not t in media.tags_media:
				media.tags_media.append(t)
		media.save()
		return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
	else:
		return HttpResponseRedirect(request.META.get('HTTP_REFERER'))

@login_required(login_url='/login/')
def crear_etiqueta_view(request, id_ssp):
	proyecto = userSoftSystemProject.objects.get(id=id_ssp)
	form = etiquetaForm()
	if request.method == "POST":
		form = etiquetaForm(request.POST)
		if form.is_valid():
			name_tag = form.cleaned_data['name_tag']
			description_tag = form.cleaned_data['description_tag']
			newTag = Etiqueta.objects.create(name_tag=name_tag, description_tag=description_tag)
			newTag.save()

			stateOne = StateOne.objects.get(ssp_stateOne=proyecto)
			stateOne.tags_state.append(newTag.id)
			stateOne.save()

			return HttpResponseRedirect(request.META.get('HTTP_REFERER'))

@login_required(login_url='/login/')
def eliminar_etiqueta_media_view(request, id_media,id_tag):
	media = Media.objects.get(id=id_media)
	del media.tags_media[media.tags_media.index(id_tag)]
	media.save()
	return HttpResponseRedirect(request.META.get('HTTP_REFERER'))

@login_required(login_url='/login/')
def analisis_view(request, id_ssp, page):
	proyecto = userSoftSystemProject.objects.get(id=id_ssp)
	destinatarios = proyecto.returnAllusers(request.user.get_username())
	stateOne = StateOne.objects.get(ssp_stateOne=proyecto)
	newAnalisisForm = nombreAnalisisForm()
	analisis = stateOne.returnAnalisis()
	paginator = Paginator(analisis, 5)
	try:
		pagina = int(page)
	except:
		page = 1
	try:
		list_analisis = paginator.page(pagina)
	except (EmptyPage, InvalidPage):
		list_analisis = paginator.page(paginator.num_pages)
	title = "Analisis"
	ctx = {'proyecto':proyecto, 'media' : list_analisis, 'title' : title, 'newAnalisisForm' : newAnalisisForm, 'destinatarios': destinatarios}
	return render (request, 'estado_uno/estado_uno_analisis.html', ctx)
	
@login_required(login_url='/login/')
def analisis_crear_view(request, id_ssp):
	if request.method == "POST":
		form = nombreAnalisisForm(request.POST)
		if form.is_valid():
			name_analisis = form.cleaned_data['name_analisis']
			newAnalisis = Analisis.objects.create(name_analisis=name_analisis, created_by=request.user.get_username())
			newAnalisis.save()

			proyecto = userSoftSystemProject.objects.get(id=id_ssp)
			stateOne = StateOne.objects.get(ssp_stateOne=proyecto)
			stateOne.ssp_analisis.append(newAnalisis.id)
			stateOne.save()

			return HttpResponseRedirect(request.META.get('HTTP_REFERER'))

@login_required(login_url='/login/')
def analisis_eliminar_view(request, id_ssp, id_analisis):
	proyecto = userSoftSystemProject.objects.get(id=id_ssp)
	stateOne = StateOne.objects.get(ssp_stateOne=proyecto)
	analisis = Analisis.objects.get(id=id_analisis)
	comentariosAnalisis = analisis.returnComments()
	documentosAnalisis = analisis.returnDocuments()
	
	for c in comentariosAnalisis:
		c.delete()

	for d in documentosAnalisis:
		d.delete()

	del stateOne.ssp_analisis[stateOne.ssp_analisis.index(analisis.id)]

	stateOne.save()
	analisis.delete()
	return HttpResponseRedirect(request.META.get('HTTP_REFERER'))

@login_required(login_url='/login/')
def analisis_desarrollo_view(request, id_ssp, id_analisis):
	proyecto = userSoftSystemProject.objects.get(id=id_ssp)
	destinatarios = proyecto.returnAllusers(request.user.get_username())
	analisis = Analisis.objects.get(id=id_analisis)
	documentosAnalisis = analisis.returnDocuments()
	etiquetasAnalisis = analisis.returnTags()
	estado = StateOne.objects.get(ssp_stateOne=proyecto)
	etiquetas = estado.returnTags()
	formDocumento = documentoForm()
	resumenForm = resumenAnalisisForm(initial={
					'description_analisis' : analisis.description_analisis,
		})
	ctx={'proyecto' : proyecto, 'analisis' : analisis, 'documentosAnalisis' : documentosAnalisis, 'formDocumento' : formDocumento, 'etiquetasAnalisis' : etiquetasAnalisis, 'etiquetas' : etiquetas, 'resumenForm' : resumenForm, 'destinatarios' : destinatarios}
	return render(request, 'estado_uno/estado_uno_desarrollo_analisis.html', ctx)

@login_required(login_url='/login/')
def analisis_newDocumento_view(request, id_analisis):
	if request.method == "POST":
		form = documentoForm(request.POST)
		if form.is_valid():
			name_documento = form.cleaned_data['name_documento']
			url_documento = form.cleaned_data['url_documento']
			newDocumento = DocumentoAnalisis.objects.create(name_documento=name_documento, url_documento=url_documento, shared_documento=request.user.get_username())
			newDocumento.save()

			analisis = Analisis.objects.get(id=id_analisis)
			analisis.links_analisis.append(newDocumento.id)
			analisis.save()
			return HttpResponseRedirect(request.META.get('HTTP_REFERER'))

@login_required(login_url='/login/')
def analisis_eliminarDocumento_view(request, id_analisis, id_documento):
	documento = DocumentoAnalisis.objects.get(id=id_documento)
	analisis = Analisis.objects.get(id=id_analisis)

	del analisis.links_analisis[analisis.links_analisis.index(documento.id)]
	analisis.save()

	documento.delete()
	return HttpResponseRedirect(request.META.get('HTTP_REFERER'))

@login_required(login_url='/login/')
def eliminar_etiqueta_analisis_view(request, id_analisis,id_tag):
	analisis = Analisis.objects.get(id=id_analisis)
	del analisis.tags_analisis[analisis.tags_analisis.index(id_tag)]
	analisis.save()
	return HttpResponseRedirect(request.META.get('HTTP_REFERER'))

@login_required(login_url='/login/')
def etiquetar_analisis_view(request, id_analisis):
	tags = request.POST.getlist('e9')
	if tags:
		analisis = Analisis.objects.get(id=id_analisis)
		for t in tags:
			if not t in analisis.tags_analisis:
				analisis.tags_analisis.append(t)
		analisis.save()
		return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
	else:
		return HttpResponseRedirect(request.META.get('HTTP_REFERER'))

@login_required(login_url='/login/')
def resumen_analisis_view(request, id_analisis):
	if request.method == "POST":
		form = resumenAnalisisForm(request.POST)
		if form.is_valid():
			resumen = form.cleaned_data['description_analisis']
			analisis = Analisis.objects.get(id=id_analisis)
			analisis.description_analisis = resumen
			analisis.save()
			return HttpResponseRedirect(request.META.get('HTTP_REFERER'))

@login_required(login_url='/login/')
def analisis_ver_view(request, id_ssp, id_analisis):
	proyecto = userSoftSystemProject.objects.get(id=id_ssp)
	destinatarios = proyecto.returnAllusers(request.user.get_username())
	analisis = Analisis.objects.get(id=id_analisis)
	documentosAnalisis = analisis.returnDocuments()
	etiquetasAnalisis = analisis.returnTags()
	comentarios = analisis.returnComments()
	formComentary = comentaryForm()
	ctx = {'proyecto' : proyecto, 'analisis' : analisis, 'documentosAnalisis' : documentosAnalisis, 'etiquetasAnalisis' : etiquetasAnalisis, 'comentarios' : comentarios, 'formComentary' : formComentary, 'destinatarios' : destinatarios}
	return render(request, 'estado_uno/estado_uno_ver_analisis.html', ctx)

@login_required(login_url='/login/')
def comentar_analisis_view(request, id_analisis):
	analisis = Analisis.objects.get(id=id_analisis)
	user = User.objects.get(username__exact=request.user.get_username())
	form = comentaryForm()
	if request.method == "POST":
		form = comentaryForm(request.POST)
		if form.is_valid():
			comentario = form.cleaned_data['comentary']
			newComment = Comentario.objects.create(autor_comentary=user, content_comentary=comentario)
			newComment.save()
			analisis.comments_analisis.append(newComment.id)
			analisis.save()
			return HttpResponseRedirect(request.META.get('HTTP_REFERER'))