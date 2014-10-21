from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator, EmptyPage, InvalidPage
from django.http import HttpResponseRedirect
from django.contrib.auth.models import User

from myapp.modulos.principal.models import userSoftSystemProject
from myapp.modulos.principal.functions import members_only
from myapp.modulos.estado_3.models import StateThree, DefinicionRaiz, DefinicionRaizCATWOE
from myapp.modulos.estado_3.forms import nombreDefinicionRaizForm, catwoeForm, addDefinicionRaizForm
from myapp.modulos.estado_3.functions import propuestaDefinicionRaiz
from myapp.modulos.estado_2.models import StateTwo
from myapp.modulos.estado_1.forms import resumenAnalisisForm, comentaryForm
from myapp.modulos.estado_1.models import Comentario
from myapp.modulos.comunicacion.functions import notificar
# Create your views here.
@login_required(login_url='/login/')
def general_tres_view(request, id_ssp):
	if members_only(id_ssp, request):
		proyecto = userSoftSystemProject.objects.get(id=id_ssp)
		stateThree = StateThree.objects.get(ssp_stateThree=proyecto)
		definicionesRaices = stateThree.returnDefinicionesRaices()[:5]
		destinatarios = proyecto.returnAllusers(request.user.get_username())

		ctx = {'proyecto' : proyecto, 'destinatarios' : destinatarios, 'definicionesRaices' : definicionesRaices}
		return render(request, 'estado_tres/estado_tres_general.html', ctx)
	else:
		return render(request, 'comunicacion/error.html')

@login_required(login_url='/login/')
def definicionesRaiz_view(request, id_ssp, page):
	if members_only(id_ssp, request):
		proyecto = userSoftSystemProject.objects.get(id=id_ssp)
		stateThree = StateThree.objects.get(ssp_stateThree=proyecto)
		definicionesRaices = stateThree.returnDefinicionesRaices()
		destinatarios = proyecto.returnAllusers(request.user.get_username())

		paginator = Paginator(definicionesRaices, 5)
		try:
			pagina = int(page)
		except:
			page = 1
		try:
			list_definiciones = paginator.page(pagina)
		except (EmptyPage, InvalidPage):
			list_definiciones = paginator.page(paginator.num_pages)

		ctx = {'proyecto' : proyecto, 'destinatarios' : destinatarios, 'definicionesRaices' : list_definiciones}
		return render(request, 'estado_tres/estado_tres_definicionesRaices.html', ctx)
	else:
		return render(request, 'comunicacion/error.html')

@login_required(login_url='/login/')
def definicionRaiz_crear_view(request, id_ssp):
	if members_only(id_ssp, request):
		if request.method == "POST":
			form = nombreDefinicionRaizForm(request.POST)
			if form.is_valid():
				name_dr = form.cleaned_data['name_dr']
				newDR = DefinicionRaizCATWOE.objects.create(name_dr=name_dr, created_by=request.user.get_username())
				newDR.save()

				proyecto = userSoftSystemProject.objects.get(id=id_ssp)
				stateThree = StateThree.objects.get(ssp_stateThree=proyecto)
				stateThree.ssp_definicionesRaices.append(newDR.id)
				stateThree.save()

				notificar(id_ssp, request.user.id, '/verDefinicionRaiz/%s/%s'%(id_ssp,newDR.id), 'Agrego una nueva Definicion Raiz', newDR.id, 'DefinicionRaiz')


				return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
			return HttpResponseRedirect(request.META.get('HTTP_REFERER'))

	else:
		return render(request, 'comunicacion/error.html')

@login_required(login_url='/login/')
def definicionRaiz_eliminar_view(request, id_ssp, id_dr):
	if members_only(id_ssp, request):
		proyecto = userSoftSystemProject.objects.get(id=id_ssp)
		stateThree = StateThree.objects.get(ssp_stateThree=proyecto)
		definicionRaiz = DefinicionRaizCATWOE.objects.get(id=id_dr)
		comentariosDefinicion = definicionRaiz.returnComments()
		definiciones = definicionRaiz.returnDefiniciones()

		for c in comentariosDefinicion:
			c.delete()
		
		for d in definiciones:
			d.delete()

		del stateThree.ssp_definicionesRaices[stateThree.ssp_definicionesRaices.index(definicionRaiz.id)]

		stateThree.save()
		definicionRaiz.delete()
		return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
	else:
		return render(request, 'comunicacion/error.html')

@login_required(login_url='/login/')
def definicionRaiz_desarrollo_view(request, id_ssp, id_dr):
	if members_only( id_ssp, request):
		proyecto = userSoftSystemProject.objects.get(id=id_ssp)
		destinatarios = proyecto.returnAllusers(request.user.get_username())
		definicionRaiz = DefinicionRaizCATWOE.objects.get(id=id_dr)
		stateTwo = StateTwo.objects.get(ssp_stateTwo=proyecto)
		richPictures = stateTwo.returnRichPictures()
		richPictureFinal = definicionRaiz.returnRichPicture()

		formCATWOE = catwoeForm(initial={
				'clientes_dr' : definicionRaiz.clientes_dr,
				'actores_dr' : definicionRaiz.actores_dr,
				'trans_input_dr' : definicionRaiz.trans_input_dr,
				'trans_output_dr' : definicionRaiz.trans_output_dr,
				'cosmo_dr' : definicionRaiz.cosmo_dr,
				'propietario_dr' : definicionRaiz.propietario_dr,
				'entorno_dr' : definicionRaiz.entorno_dr,
			})

		sugerencia = propuestaDefinicionRaiz(id_dr)


		resumenForm = resumenAnalisisForm(initial={
				'description_analisis' : definicionRaiz.description_dr
			})
		definicionesRaiz = definicionRaiz.returnDefiniciones()
		definicionRaizFinal = definicionRaiz.returnDefinicion()
		ctx = {'proyecto' : proyecto, 'destinatarios' : destinatarios, 
				'definicionRaiz' : definicionRaiz, 'richPictures' : richPictures, 
				'richPictureFinal' : richPictureFinal, 'formCATWOE' : formCATWOE, 
				'definicionesRaiz' : definicionesRaiz, 'definicionRaizFinal' : definicionRaizFinal,
				'resumenForm' : resumenForm, 'sugerencia' : sugerencia}
		return render(request, 'estado_tres/estado_tres_desarrollo.html', ctx)
	else:
		return render(request, 'comunicacion/error.html')

@login_required(login_url='/login/')
def definicionRaiz_adjuntarRichPicture_view(request, id_dr):
	idRichPicture = request.POST['e12']
	definicionRaiz = DefinicionRaizCATWOE.objects.get(id=id_dr)
	definicionRaiz.richPicture_dr = idRichPicture
	definicionRaiz.save()
	return HttpResponseRedirect(request.META.get('HTTP_REFERER'))

@login_required(login_url='/login/')
def definicionRaiz_adjuntarDefinicionRaiz_view(request, id_dr):
	idDefinicionRaiz = request.POST['e13']
	definicionRaiz = DefinicionRaizCATWOE.objects.get(id=id_dr)
	definicionRaiz.definicionFinal_dr = idDefinicionRaiz
	definicionRaiz.save()
	return HttpResponseRedirect(request.META.get('HTTP_REFERER'))

@login_required(login_url='/login/')
def definicionRaiz_newCatwoe_view(request, id_dr):
	definicionRaiz = DefinicionRaizCATWOE.objects.get(id=id_dr)
	if request.method == "POST":
		form = catwoeForm(request.POST)
		if form.is_valid():
			clientes_dr = form.cleaned_data['clientes_dr']
			actores_dr = form.cleaned_data['actores_dr']
			trans_input_dr = form.cleaned_data['trans_input_dr']
			trans_output_dr = form.cleaned_data['trans_output_dr']
			cosmo_dr = form.cleaned_data['cosmo_dr']
			propietario_dr = form.cleaned_data['propietario_dr']
			entorno_dr = form.cleaned_data['entorno_dr']

			definicionRaiz.clientes_dr = clientes_dr
			definicionRaiz.actores_dr = actores_dr
			definicionRaiz.trans_input_dr = trans_input_dr
			definicionRaiz.trans_output_dr = trans_output_dr
			definicionRaiz.cosmo_dr = cosmo_dr
			definicionRaiz.propietario_dr = propietario_dr
			definicionRaiz.entorno_dr = entorno_dr

			definicionRaiz.save()
			return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
		return HttpResponseRedirect(request.META.get('HTTP_REFERER'))


@login_required(login_url='/login/')
def definicionRaiz_add_view(request, id_dr):
	definicionRaiz = DefinicionRaizCATWOE.objects.get(id=id_dr)
	if request.method == "POST":
		form = addDefinicionRaizForm(request.POST)
		if form.is_valid():
			name_DR = form.cleaned_data['name_DR']
			description_DR = form.cleaned_data['description_DR']
			newDR = DefinicionRaiz.objects.create(name_DR=name_DR, description_DR=description_DR, created_by=request.user.get_username())
			newDR.save()
			definicionRaiz.definiciones_dr.append(newDR.id)
			definicionRaiz.save()
			return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
		return HttpResponseRedirect(request.META.get('HTTP_REFERER'))


@login_required(login_url='/login/')
def DF_eliminar_view(request, id_ssp,id_dr, id_dr2):
	if members_only(id_ssp, request):
		definicionRaiz = DefinicionRaiz.objects.get(id=id_dr2)
		definicionRaizCat = DefinicionRaizCATWOE.objects.get(id=id_dr)

		del definicionRaizCat.definiciones_dr[definicionRaizCat.definiciones_dr.index(definicionRaiz.id)]
		if definicionRaizCat.definicionFinal_dr == definicionRaiz.id:
			definicionRaizCat.definicionFinal_dr = None
		definicionRaizCat.save()

		definicionRaiz.delete()
		return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
	else:
		return render(request, 'comunicacion/error.html')

@login_required(login_url='/login/')
def definicionRaiz_resumen_view(request, id_dr):
	if request.method == "POST":
		form = resumenAnalisisForm(request.POST)
		if form.is_valid():
			resumen = form.cleaned_data['description_analisis']
			definicionRaiz = DefinicionRaizCATWOE.objects.get(id=id_dr)
			definicionRaiz.description_dr = resumen
			definicionRaiz.save()
			return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
		return HttpResponseRedirect(request.META.get('HTTP_REFERER'))


@login_required(login_url='/login/')
def definicionRaiz_single_view(request, id_ssp,id_dr):
	if members_only(id_ssp, request):
		try:
			proyecto = userSoftSystemProject.objects.get(id=id_ssp)
			destinatarios = proyecto.returnAllusers(request.user.get_username())
			definicionRaiz = DefinicionRaizCATWOE.objects.get(id=id_dr)
			definicionRaizFinal = definicionRaiz.returnDefinicion()
			richPictureFinal = definicionRaiz.returnRichPicture()
			comentarios = definicionRaiz.returnComments()
			ctx = {'proyecto' : proyecto, 'destinatarios' : destinatarios, 
				'definicionRaiz' : definicionRaiz, 'definicionRaizFinal': definicionRaizFinal,
				'richPictureFinal' : richPictureFinal, 'comentarios' : comentarios}
			return render(request, 'estado_tres/estado_tres_definicionraiz_single.html', ctx)
		except:
			return render(request, 'comunicacion/error.html')
	else:
		return render(request, 'comunicacion/error.html')
		
@login_required(login_url='/login/')
def definicionRaiz_comentar_view(request, id_dr, id_ssp):
	if members_only(id_ssp, request):
		definicionRaiz = DefinicionRaizCATWOE.objects.get(id=id_dr)
		user = User.objects.get(username__exact=request.user.get_username())
		form = comentaryForm()
		if request.method == "POST":
			form = comentaryForm(request.POST)
			if form.is_valid():
				comentario = form.cleaned_data['comentary']
				newComment = Comentario.objects.create(autor_comentary=user, content_comentary=comentario)
				newComment.save()
				definicionRaiz.comments_dr.append(newComment.id)
				definicionRaiz.save()
				notificar(id_ssp, request.user.id, '/verDefinicionRaiz/%s/%s'%(id_ssp,id_dr), 'Ha comentado una Definicion Raiz', id_dr, 'DefinicionRaiz')

				return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
			return HttpResponseRedirect(request.META.get('HTTP_REFERER'))

	else:
		return render(request, 'comunicacion/error.html')