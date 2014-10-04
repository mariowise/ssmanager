from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from myapp.modulos.principal.models import userSoftSystemProject, userProfile
from django.contrib.auth.models import User
from django.http import HttpResponseRedirect

# Create your views here.
@login_required(login_url='/login/')
def contrib_view(request, id_ssp):
	proyecto = userSoftSystemProject.objects.get(id=id_ssp)
	destinatarios = proyecto.returnAllusers(request.user.get_username())
	usuarios = User.objects.filter(is_staff=False)
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
			contribP = userProfile.objects.get(user=user)
			contribP.project_colab_user.append(proyecto.id)
			contribP.save()
			proyecto.contribs_ssp.append(nameContrib)
			proyecto.save()
			usersObj = proyecto.contribUsers()	
			status = "1"
			ctx = {'proyecto':proyecto, 'status': status, 'usuarios' : usersObj, 
					'destinatarios' : destinatarios, 'usuariosSSM' : usuarios}
			return render(request, 'proyecto/add_colaborador.html', ctx)

	usersObj = proyecto.contribUsers()	
	ctx = {'proyecto':proyecto, 'usuarios' : usersObj, 
			'destinatarios' : destinatarios, 'usuariosSSM' : usuarios}
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