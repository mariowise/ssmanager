from django import forms

class nombreDefinicionRaizForm(forms.Form):
	name_dr = forms.CharField(label="Nombre de Definicion Raiz", widget=forms.TextInput(), required=True)

class catwoeForm(forms.Form):
	clientes_dr = forms.CharField(label="Clientes:", widget=forms.Textarea, required=True)
	actores_dr = forms.CharField(label="Actores:", widget=forms.Textarea, required=True)
	trans_input_dr = forms.CharField(label="Transformacion (Entrada):", widget=forms.Textarea, required=True)
	trans_output_dr = forms.CharField(label="Transformacion (Salida):", widget=forms.Textarea, required=True)
	cosmo_dr = forms.CharField(label="Weltanschauung:", widget=forms.Textarea, required=True)
	propietario_dr = forms.CharField(label="Propietario:", widget=forms.Textarea, required=True)
	entorno_dr = forms.CharField(label="Entorno:", widget=forms.Textarea, required=True)

class addDefinicionRaizForm(forms.Form):
	name_DR = forms.CharField(label="Nombre de Sistema de Actividad Humano", widget=forms.TextInput(), required=True)
	description_DR = forms.CharField(label="Definicion:", widget=forms.Textarea,required=True)
