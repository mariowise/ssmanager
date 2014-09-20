from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect

from myapp.modulos.principal.models import userSoftSystemProject
from myapp.modulos.estado_1.forms import mediaForm, comentaryForm, etiquetaForm
from myapp.modulos.estado_1.models import Media, StateOne, Comentario, Etiqueta
from myapp.modulos.estado_1.functions import video_id
# Create your views here.
@login_required(login_url='/login/')
def general_uno_view(request, id_ssp):
	project = userSoftSystemProject.objects.get(id=id_ssp)
	stateOne = StateOne.objects.get(ssp_stateOne=project)
	videos = stateOne.returnVideos()[:5]
	imagenes = stateOne.returnImagenes()[:5]
	audios = stateOne.returnAudios()[:5]
	documentos = stateOne.returnDocumentos()[:5]
	analisis = stateOne.returnAnalisis()[:5]
	form = mediaForm()
	ctx = {'proyecto':project, 'videos' : videos, 'imagenes' : imagenes, 'audios' : audios, 'documentos' : documentos, 'analisis' : analisis, 'form' : form}
	return render (request, 'estado_uno/estado_uno_general.html', ctx)

@login_required(login_url='/login/')
def media_view(request, id_type, id_ssp):
	project = userSoftSystemProject.objects.get(id=id_ssp)
	stateOne = StateOne.objects.get(ssp_stateOne=project)
	tipo_media = id_type
	form = mediaForm()
	title = ""

	if tipo_media == '1':
		videos = stateOne.returnVideos()
		title = "Videos"
		ctx = {'proyecto':project, 'media' : videos, 'tipo' : tipo_media, 'title' : title, 'form' : form}
		return render (request, 'estado_uno/estado_uno_medias.html', ctx)

	if tipo_media == '2':
		imagenes = stateOne.returnImagenes()
		title = "Imagenes"
		ctx = {'proyecto':project, 'media' : imagenes, 'tipo' : tipo_media, 'title' : title, 'form' : form}
		return render (request, 'estado_uno/estado_uno_medias.html', ctx)

	if tipo_media == '3':
		audios = stateOne.returnAudios()
		title = "Audios"
		ctx = {'proyecto':project, 'media' : audios, 'tipo' : tipo_media, 'title' : title, 'form' : form}
		return render (request, 'estado_uno/estado_uno_medias.html', ctx)

	if tipo_media == '4':
		documentos = stateOne.returnDocumentos()
		title = "Documentos"
		ctx = {'proyecto':project, 'media' : documentos, 'tipo' : tipo_media, 'title' : title, 'form' : form}
		return render (request, 'estado_uno/estado_uno_medias.html', ctx)
	
	if tipo_media == '5':
		analisis = stateOne.returnAnalisis()
		title = "Analisis"
		ctx = {'proyecto':project, 'media' : analisis, 'tipo' : tipo_media, 'title' : title, 'form' : form}
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

@login_required(login_url='/login/')
def media_ver_view(request, id_ssp, id_media):
	project = userSoftSystemProject.objects.get(id=id_ssp)
	estado = StateOne.objects.get(ssp_stateOne=project)
	etiquetas = estado.returnTags()

	media = Media.objects.get(id=id_media)
	comentarios = media.returnComments()
	etiquetasMedia = media.returnTags()

	formComentary = comentaryForm()
	formaTag = etiquetaForm()
	formAdd = mediaForm()
	if media.type_media == '1':
		embed = video_id(media.url_media)
		ctx={'proyecto' : project, 'media' : media, 'comentarios':comentarios, 'formComentary' : formComentary, 'etiquetas':etiquetas, 'etiquetasMedia' : etiquetasMedia, 'formaTag':formaTag, 'embed' : embed, 'form' : formAdd}
		return render(request, 'estado_uno/estado_uno_media_single.html', ctx)
	else :
		ctx={'proyecto' : project, 'media' : media, 'comentarios':comentarios, 'formComentary' : formComentary, 'etiquetas':etiquetas, 'etiquetasMedia' : etiquetasMedia, 'formaTag':formaTag, 'form' : formAdd}
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

	if media.type_media == '5':
		del estado.ssp_analisis[estado.ssp_analisis.index(media.id)]

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
