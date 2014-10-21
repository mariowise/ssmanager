from django import forms

class nombreRichPictureForm(forms.Form):
	name_rp = forms.CharField(label="Nombre de Rich Picture", widget=forms.TextInput(), required=True)

class drawRichPictureForm(forms.Form):
	name_documento = forms.CharField(label="Nombre del Documento", widget=forms.TextInput(), required=True)