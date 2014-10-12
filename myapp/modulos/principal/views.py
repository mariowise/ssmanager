from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.http import HttpResponseRedirect

from myapp.modulos.principal.forms import UserSettings, UserPasswordChange, UserNotifications, UserNewProject
from myapp.modulos.principal.models import userProfile, userSoftSystemProject
from myapp.modulos.estado_1.models import StateOne
from myapp.modulos.estado_2.models import StateTwo
from myapp.modulos.estado_3.models import StateThree
from myapp.modulos.principal.models import CredentialsModel
from myapp import settings

from oauth2client.client import flow_from_clientsecrets
from oauth2client import xsrfutil
from oauth2client.django_orm import Storage
from apiclient.discovery import build
import httplib2


import os



CLIENT_SECRETS = os.path.join(os.path.dirname(__file__), 'client_secrets.json')
FLOW = flow_from_clientsecrets(
    CLIENT_SECRETS,
    scope='https://www.googleapis.com/auth/drive',
    redirect_uri='http://localhost:8000/oauth2callback/')
	# Create your views here.
@login_required(login_url='/login/')
def principal_view(request):
	#Aqui cargo los datos del usuario
	user = User.objects.get(username__exact=request.user.get_username())
	userProjects = userSoftSystemProject.objects.filter(manager=user)
	projectsContrib = user.get_profile().contribProjects()
	ctx = {'proyectos' : userProjects, 'proyectosColabora' : projectsContrib}
	return render(request,'principal/principal.html', ctx)

@login_required(login_url='/login/')
def settings_view(request):
	#Aqui cargo los datos del usuario
	user = userProfile.objects.get(user=request.user)
	status = ""
	if request.method == "POST":
		form = UserSettings(request.POST, request.FILES)
		if form.is_valid():
			email_public_user = form.cleaned_data['email_public_user']
			url_user = form.cleaned_data['url_user']
			company_user = form.cleaned_data['company_user']
			position_user = form.cleaned_data['position_user']
			photo_user = form.cleaned_data['photo_user']


			user.email_public_user = email_public_user
			user.url_user = url_user
			user.company_user = company_user
			user.position_user = position_user
			user.photo_user = photo_user
			user.save()
			status="1"
			ctx = {'status':status, 'form':form}
			return render(request,'principal/user_account_settings.html', ctx)

	if request.method == "GET":
		form = UserSettings(initial={
				'email_public_user' : user.email_public_user,
				'url_user' : user.url_user,
				'company_user' : user.company_user,
				'position_user' : user.position_user,
			})
	ctx = {'form': form, 'usuario': user.photo_user}
	return render(request,'principal/user_account_settings.html', ctx)

@login_required(login_url='/login/')
def password_change_view(request):
	form = UserPasswordChange()
	status = ""
	if request.method == "POST":
		form = UserPasswordChange(request.POST)
		if form.is_valid():
			password = form.cleaned_data['old_pass_user']
			user = User.objects.get(username__exact=request.user.get_username())
			if user is not None and user.check_password(password):
				newpassword = form.cleaned_data['new_pass_user']
				user.set_password(newpassword)
				user.save()
				status = "1"
				form = UserPasswordChange()
				ctx = {'status' : status, 'form':form}
				return render(request, 'principal/user_account_password.html', ctx)
			else:
				status = "0"
				form = UserPasswordChange()
				ctx = {'status' : status, 'form':form}
				return render(request, 'principal/user_account_password.html', ctx)
	
	if request.method == "GET":
		ctx = {'form': form}
		return render(request, 'principal/user_account_password.html', ctx)

@login_required(login_url='/login/')
def notification_settings_view(request):
	user = userProfile.objects.get(user=request.user)
	status = ""
	if request.method == "POST":
		form = UserNotifications(request.POST)
		if form.is_valid():
			mWeb_user = form.cleaned_data['mWeb_user']
			mEmail_user = form.cleaned_data['mEmail_user']
	 		cWeb_user = form.cleaned_data['cWeb_user']
			cEmail_user = form.cleaned_data['cEmail_user']

			user.mWeb_user = mWeb_user
			user.mEmail_user = mEmail_user
			user.cWeb_user = cWeb_user
			user.cEmail_user = cEmail_user

			user.save()
			status="1"
			ctx = {'status':status, 'form':form}
			return render(request,'principal/user_account_notification.html', ctx)

	if request.method == "GET":
		form = UserNotifications(initial={
				'mWeb_user' : user.mWeb_user,
				'mEmail_user' : user.mEmail_user,
				'cWeb_user' : user.cWeb_user,
				'cEmail_user' : user.cEmail_user,
			})
	ctx = {'form': form}
	return render(request,'principal/user_account_settings.html', ctx)

@login_required(login_url='/login/')
def projects_view(request):
	perfilUser = userProfile.objects.get(user=request.user)
	proyectosColabora = perfilUser.contribProjects()
	ctx = {'proyectos' : proyectosColabora}
	return render(request, 'principal/user_account_projects.html', ctx)

@login_required(login_url='/login/')
def create_ssp_view(request):
	#Aqui cargo los datos del usuario
	form = UserNewProject()
	status = ""

	if request.method == "POST":
		if 'create_ssp' in request.POST:
			form = UserNewProject(request.POST)
			if form.is_valid():
				storage = Storage(CredentialsModel, 'id_user', request.user, 'credential')
				credential = storage.get()
				if credential is None or credential.invalid:
					FLOW.params['state'] = xsrfutil.generate_token(settings.SECRET_KEY,request.user)
					authorize_url = FLOW.step1_get_authorize_url()
					return HttpResponseRedirect(authorize_url)
				else:
					name_ssp = form.cleaned_data['name_ssp']
					description_ssp = form.cleaned_data['description_ssp']
					user = User.objects.get(username__exact=request.user.get_username())
					projectsUser = userSoftSystemProject.objects.filter(manager=user, name_ssp=name_ssp)

					if projectsUser:
						status = "0"
						form = UserNewProject()
						ctx = {'status' : status, 'form' : form}
						return render(request,'principal/user_new_ssp.html', ctx)
						
					newSSP = userSoftSystemProject.objects.create(manager = user, name_ssp = name_ssp, description_ssp = description_ssp)
					newStateOne = StateOne.objects.create(ssp_stateOne = newSSP)
					newStateTwo = StateTwo.objects.create(ssp_stateTwo = newSSP)
					newStateThree = StateThree.objects.create(ssp_stateThree = newSSP)
					newSSP.save()
					newStateOne.save()
					newStateTwo.save()
					newStateThree.save()

					storage = Storage(CredentialsModel, 'id_user', request.user, 'credential')
					credential = storage.get()
					http = httplib2.Http()
					http = credential.authorize(http)
					drive_service = build('drive', 'v2', http=http, developerKey="hbP6_4UJIKe-m74yLd8tQDfT")

					body = {
			          'title': 'Soft System Manager - %s'%(newSSP.name_ssp),
			          'mimeType': "application/vnd.google-apps.folder"
			        }

					folder = drive_service.files().insert(body = body).execute()

					newSSP.id_folder_ssp = folder.get('id')
					newSSP.save()
					return redirect('vista_principal')
				
	ctx = {'form': form}
	return render(request,'principal/user_new_ssp.html', ctx)