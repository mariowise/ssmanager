from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from myapp.modulos.principal.models import userSoftSystemProject, userProfile
from myapp.modulos.principal.forms import ProjectAddContrib
from django.contrib.auth.models import User
from django.http import HttpResponseRedirect

# Create your views here.
@login_required(login_url='/login/')
def contrib_view(request, id_ssp):
	form = ProjectAddContrib()
	proyecto = userSoftSystemProject.objects.get(id=id_ssp)
	ctx = {}
	usersObj = []
	status = ""
	if request.method == "POST":
		form = ProjectAddContrib(request.POST)
		if form.is_valid():
			nameContrib = form.cleaned_data['contrib_username']
			try:
				user = User.objects.get(username__exact=nameContrib)
			except:
				form = ProjectAddContrib()
				status = "0"
				usersObj = proyecto.contribUsers()	
				ctx = {'proyecto':proyecto, 'form' : form, 'status': status, 'usuarios' : usersObj}
				return render(request, 'proyecto/add_colaborador.html', ctx)

			if user.get_username() in proyecto.contribs_ssp or proyecto.manager.get_username() == nameContrib:
				form = ProjectAddContrib()
				status = "2"
				usersObj = proyecto.contribUsers()	
				ctx = {'proyecto':proyecto, 'form' : form, 'status': status, 'usuarios' : usersObj}
				return render(request, 'proyecto/add_colaborador.html', ctx)
			else:
				contribP = userProfile.objects.get(user=user)
				contribP.project_colab_user.append(proyecto.id)
				contribP.save()
				proyecto.contribs_ssp.append(nameContrib)
				proyecto.save()
				usersObj = proyecto.contribUsers()	
				form = ProjectAddContrib()
				status = "1"
				ctx = {'proyecto':proyecto, 'form' : form, 'status': status, 'usuarios' : usersObj}
				return render(request, 'proyecto/add_colaborador.html', ctx)

	usersObj = proyecto.contribUsers()	
	ctx = {'proyecto':proyecto, 'form' : form, 'usuarios' : usersObj}
	return render(request, 'proyecto/add_colaborador.html', ctx)

@login_required(login_url='/login/')
def profile_view(request, id_ssp, id_user):
	user = User.objects.get(id=id_user)
	proyecto = userSoftSystemProject.objects.get(id=id_ssp)
	ctx = {'usuario' : user, 'proyecto': proyecto}
	return render(request, 'proyecto/profile.html', ctx)

@login_required(login_url='/login/')
def desvincularColaborador_view(request, id_ssp, id_user):
	proyecto = userSoftSystemProject.objects.get(id=id_ssp)
	usuario = User.objects.get(id=id_user)
	usuarioProfile = userProfile.objects.get(user=usuario)
	nombreUser = usuario.get_username()
	del proyecto.contribs_ssp[proyecto.contribs_ssp.index(nombreUser)]
	del usuarioProfile.project_colab_user[usuarioProfile.project_colab_user.index(proyecto.id)]
	usuarioProfile.save()
	proyecto.save()
	return HttpResponseRedirect(request.META.get('HTTP_REFERER'))