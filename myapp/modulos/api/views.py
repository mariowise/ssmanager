 # -*- encoding: utf-8 -*-

from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect, HttpResponse
from django.core.paginator import Paginator, EmptyPage, InvalidPage
from django.core import serializers
from django.views.decorators.csrf import csrf_exempt

from myapp.modulos.api.utils import *


import os
import json

from myapp.modulos.principal.models import userProfile, userSoftSystemProject

# Profile
def profiles_view(request):
	objects = userProfile.objects.all()
	return respond_with(objects)

# Projects
def user_softsystem_project_index(request):
	objects = userSoftSystemProject.objects.all()
	return respond_with(objects)

def user_softsystem_project_show(request, ssp_id):
	item = userSoftSystemProject.objects.get(id=ssp_id)
	return respond_with([item])

@csrf_exempt
def user_softsystem_project_edit(request, ssp_id):
	item = userSoftSystemProject.objects.get(id=ssp_id)
	data = json.loads(request.POST.get('project'))

	item.description_ssp = data["description_ssp"]
	item.save()

	return respond_with([item])
	

def user_softsystem_project_destroy(request, ssp_id):
	return 




