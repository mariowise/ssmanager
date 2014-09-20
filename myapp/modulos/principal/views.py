from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from myapp.modulos.principal.forms import UserSettings, UserPasswordChange, UserNotifications, UserNewProject
from myapp.modulos.principal.models import userProfile, userSoftSystemProject
from django.contrib.auth.models import User
from myapp.modulos.estado_1.models import StateOne


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
				name_ssp = form.cleaned_data['name_ssp']
				description_ssp = form.cleaned_data['description_ssp']
				privacy_ssp = form.cleaned_data['privacy_ssp']
				user = User.objects.get(username__exact=request.user.get_username())
				projectsUser = userSoftSystemProject.objects.filter(manager=user, name_ssp=name_ssp)

				if projectsUser:
					status = "0"
					form = UserNewProject()
					ctx = {'status' : status, 'form' : form}
					return render(request,'principal/user_new_ssp.html', ctx)

				newSSP = userSoftSystemProject.objects.create(manager=user, name_ssp = name_ssp, description_ssp = description_ssp, privacy_ssp = privacy_ssp)
				newStateOne = StateOne.objects.create(ssp_stateOne=newSSP)
				newSSP.save()
				newStateOne.save()
				



				return redirect('vista_principal')

	ctx = {'form': form}
	return render(request,'principal/user_new_ssp.html', ctx)