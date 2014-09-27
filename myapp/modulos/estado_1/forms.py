from django import forms

TYPE_MEDIA = (
    	('1', 'Video'),
    	('2', 'Imagen'),
    	('3', 'Audio'),
    	('4', 'Documento'),
    	)

class mediaForm(forms.Form):
	media_name = forms.CharField(label="Nombre Archivo",widget=forms.TextInput(), required=True)
	media_description = forms.CharField(label="Descripcion Archivo", widget=forms.Textarea, required=True)
	media_url = forms.URLField(label="URL de Archivo", required=True)
	media_type = forms.ChoiceField(label="Categoria", choices=TYPE_MEDIA)



class comentaryForm(forms.Form):
	comentary = forms.CharField(label="Comentario", widget=forms.Textarea, required=True)

class etiquetaForm(forms.Form):
	name_tag = forms.CharField(label="Nombre de Etiqueta",widget=forms.TextInput(), required=True)
	description_tag = forms.CharField(label="Descripcion Etiqueta", widget=forms.Textarea, required=True)

class nombreAnalisisForm(forms.Form):
	name_analisis = forms.CharField(label="Nombre del Analisis", widget=forms.TextInput(), required=True)

class resumenAnalisisForm(forms.Form):
	description_analisis = forms.CharField(label="Resumen", widget=forms.Textarea, required=False)

class documentoForm(forms.Form):
	name_documento = forms.CharField(label="Nombre del Documento", widget=forms.TextInput(), required=True)
	url_documento = forms.URLField(label="Link para Compartir", required=True)
