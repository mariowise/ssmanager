from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from myapp.modulos.principal.models import userSoftSystemProject

# Create your views here.
@login_required(login_url='/login/')
def general_view(request, id_ssp):
	project = userSoftSystemProject.objects.get(id=id_ssp)
	
	ctx = {'proyecto':project}
	return render (request, 'estado_uno/estado_uno_general.html', ctx)

