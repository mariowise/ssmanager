from django import forms
from django.contrib.auth.models import User
	
class LoginForm(forms.Form):
    username = forms.CharField(label="Nombre de Usuario",widget=forms.TextInput())
    password = forms.CharField(label="Password",widget=forms.PasswordInput(render_value=False))

class RegisterForm(forms.Form):
	username = forms.CharField(label="Nombre de Usuario",widget=forms.TextInput())
	name = forms.CharField(label="Nombre",widget=forms.TextInput())
	last_name = forms.CharField(label="Apellido",widget=forms.TextInput())
	email = forms.EmailField(label="Correo Electronico", widget=forms.TextInput())
	password_one = forms.CharField(label="Password", widget=forms.PasswordInput(render_value=False))
	password_two = forms.CharField(label="Confirmar Password", widget=forms.PasswordInput(render_value=False))

	def clean_username(self):
		username = self.cleaned_data['username']
		try:
			newUser = User.objects.get(username=username)
		except User.DoesNotExist:
			return username
		raise forms.ValidationError('Usuario ya existe')

	def clean_email(self):
		email = self.cleaned_data['email']
		try:
			newUser = User.objects.get(email=email)
		except User.DoesNotExist:
			return email
		raise forms.ValidationError('Correo electronico ya existe')

	def clean_password(self):
		password_one = self.cleaned_data['password_one']
		password_two = self.cleaned_data['password_two']
		if password_one == password_two:
			pass
		else:
			raise forms.ValidationError('Password no coinciden')

class RecoverPasswordForm(forms.Form):
	email = forms.EmailField(label="Correo Electronico", widget=forms.TextInput())

	def clean_email(self):
		correo = self.cleaned_data['email']
		try: 
			oUser = User.objects.get(email=correo)
		except User.DoesNotExist:
			raise forms.ValidationError('Correo Electronico Incorrecto')
		return correo
