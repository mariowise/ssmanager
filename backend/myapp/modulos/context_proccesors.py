from myapp.modulos.comunicacion.forms import mensajeForm
from myapp.modulos.estado_1.forms import mediaForm, resumenAnalisisForm, comentaryForm
from myapp.modulos.estado_2.forms import nombreRichPictureForm
from myapp.modulos.estado_3.forms import nombreDefinicionRaizForm, catwoeForm, addDefinicionRaizForm

def form_mensaje_proccesor(request):
	context={ "formMensaje" : mensajeForm(),
			  "formArchivo" : mediaForm(),
			  "formRP" : nombreRichPictureForm(),
			  "resumenForm" : resumenAnalisisForm(),
			  "formComentary" : comentaryForm(),
			  "formDR" : nombreDefinicionRaizForm(),
			  "formCATWOE" : catwoeForm(),
			  "formNDR" : addDefinicionRaizForm(),
	}
	return context