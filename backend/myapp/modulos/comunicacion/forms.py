from django import forms

class mensajeForm(forms.Form):
	asunto_mensaje = forms.CharField(label="Asunto",widget=forms.TextInput(), required=True)
	contenido_mensaje = forms.CharField(label="Mensaje", widget=forms.Textarea, required=True)
