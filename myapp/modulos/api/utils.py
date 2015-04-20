# -*- encoding: utf-8 -*-

from django.http import HttpResponse
from django.core import serializers

import os
import json

# Util
# Por algún motivo funciona cuando se entrega un arreglo de objetos ODM
# Si se entrega solo un objeto del ODM, lanza un ERROR 500
def respond_with(objects):
	data = serializers.serialize("json", objects)
	response = HttpResponse(data, mimetype='application/json')
	response["Access-Control-Allow-Origin"] = "*"
	response["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS, PUT, DELETE"
	response["Access-Control-Max-Age"] = "1000"
	response["Access-Control-Allow-Headers"] = "*"
	# response["Access-Control-Allow-Credentials"] = "false"
	return response
