from django.shortcuts import redirect, render 
from django.contrib.auth.models import User
from django.contrib.auth import login, logout, authenticate
from django.http import HttpResponseBadRequest
from django.http import HttpResponseRedirect
from django.contrib.auth.decorators import login_required

from myapp.modulos.principal.models import userProfile
from myapp.modulos.presentacion.forms import RegisterForm, LoginForm, RecoverPasswordForm
from myapp.modulos.presentacion.functions import randomPassword, enviarCorreoRecover
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
def welcome_view(request):
	return render(request, 'presentacion/welcome.html')

def tour_view(request):
	return render(request,'presentacion/tour.html')

def method_view(request):
	return render(request,'presentacion/method.html')

def about_view(request):
	return render(request,'presentacion/about.html')

def signup_view(request):
	
	form = RegisterForm()
	if request.method == "POST":
		form = RegisterForm(request.POST)
		if form.is_valid():
			username = form.cleaned_data['username']
			name = form.cleaned_data['name']
			last_name = form.cleaned_data['last_name']
			email = form.cleaned_data['email']
			password_one = form.cleaned_data['password_one']
			password_two = form.cleaned_data['password_two']
			newUser = User.objects.create_user(username=username, first_name=name, last_name=last_name, email=email, password=password_one)
			newUserProfile = userProfile.objects.create(user=newUser)
			newUser.save()
			newUserProfile.save()
			return redirect('/login')
		else:
			ctx = {'form':form}
			return render(request,'presentacion/sign_up.html',ctx)
	ctx = {'form':form}
	return render(request,'presentacion/sign_up.html',ctx)

def login_view(request):

	status = ""
	if request.user.is_authenticated():
		return redirect('/principal') #Cambiar cuando este el estado disponible
	else:
		if request.method == "POST":
			form = LoginForm(request.POST)
			if form.is_valid():
				username = form.cleaned_data['username']
				password = form.cleaned_data['password']
				user = authenticate(username=username, password=password)
				if user is not None and user.is_active:
					login(request, user)
					FLOW.params['state'] = xsrfutil.generate_token(settings.SECRET_KEY,request.user)
					authorize_url = FLOW.step1_get_authorize_url()
					return HttpResponseRedirect(authorize_url)
				else:
					status = "Usuario y/o Password incorrecto"
		form = LoginForm()
		ctx = {'form':form, 'status': status}
		return render(request,'presentacion/login.html',ctx)

	return render(request,'presentacion/login.html')

def logout_view(request):
	logout(request)
	return redirect('/')

def recover_view(request):
 	form = RecoverPasswordForm()
 	status=""
 	
 	if request.method == "POST":
 		form = RecoverPasswordForm(request.POST)
 		if form.is_valid():
 			email = form.cleaned_data['email']
 			newPassword = randomPassword()
 			user = User.objects.get(email=email)
 			user.set_password(newPassword)
 			user.save()
 			enviarCorreoRecover(email, newPassword)
 			status="Correo enviado"
 			form = RecoverPasswordForm()
 			ctx={'status' : status, 'form' : form}
 			return render(request, 'presentacion/recover_password.html', ctx)

 	ctx={'form' : form}
	return render(request, 'presentacion/recover_password.html', ctx)

@login_required(login_url='/login/')
def auth_return(request):

  if not xsrfutil.validate_token(settings.SECRET_KEY, request.REQUEST['state'],
                                 request.user):
    return  HttpResponseBadRequest()
  credential = FLOW.step2_exchange(request.REQUEST)
  storage = Storage(CredentialsModel, 'id_user', request.user, 'credential')
  storage.delete()
  storage = Storage(CredentialsModel, 'id_user', request.user, 'credential')
  storage.put(credential)

  userP = userProfile.objects.get(user=request.user)
  if userP.id_drive_folder is None:
  	try:
		storage = Storage(CredentialsModel, 'id_user', request.user, 'credential')
		credential = storage.get()
		http = httplib2.Http()
		http = credential.authorize(http)
		drive_service = build('drive', 'v2', http=http, developerKey="hbP6_4UJIKe-m74yLd8tQDfT")

		body = {
          'title': 'Soft System Manager',
          'mimeType': "application/vnd.google-apps.folder"
        }
		folder = drive_service.files().insert(body = body).execute()
		userP.id_drive_folder = folder.get('id')
		userP.save()
	except:
		return redirect('vista_logout')

  return HttpResponseRedirect("/principal")

