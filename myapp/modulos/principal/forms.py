from django import forms
from django.contrib.auth.models import User
PRIVACY = (
    	('1', 'Privado'),
    	('2', 'Publico'),
    	)


class UserSettings(forms.Form):
	photo_user = forms.ImageField(label="Foto de perfil")
	email_public_user = forms.EmailField(label="Correo Electronico Publico", widget=forms.TextInput())
	url_user = forms.URLField(label="URL", widget=forms.TextInput())
	company_user = forms.CharField(label="Empresa", widget=forms.TextInput())
	position_user = forms.CharField(label="Ubicacion", widget=forms.TextInput())



class UserPasswordChange(forms.Form):
	old_pass_user = forms.CharField(label="Clave Antigua", widget=forms.PasswordInput(render_value=False))
	new_pass_user = forms.CharField(label="Clave Nueva", widget=forms.PasswordInput(render_value=False))
	conf_new_pass_user = forms.CharField(label="Confirmar Clave", widget=forms.PasswordInput(render_value=False))

	def clean_password(self):
		new_pass_user = self.cleaned_data['new_pass_user']
		conf_new_pass_user = self.cleaned_data['conf_new_pass_user']
		if new_pass_user == conf_new_pass_user:
			pass
		else:
			raise forms.ValidationError('Claves no coinciden')

class UserNotifications(forms.Form):
	mWeb_user = forms.BooleanField(label='Como Manager recibir notificaciones via Web', widget=forms.CheckboxInput(), required=False)
	mEmail_user = forms.BooleanField(label='Como Manager recibir notificaciones via Email', widget=forms.CheckboxInput(), required=False)
	cWeb_user = forms.BooleanField(label='Como Colaborador recibir notificaciones via Web', widget=forms.CheckboxInput(), required=False)
	cEmail_user = forms.BooleanField(label='Como Colaborador recibir notificaciones viaEmail', widget=forms.CheckboxInput(), required=False)

class StringListField(forms.CharField):
    def prepare_value(self, value):
        return ', '.join(value)
 
    def to_python(self, value):
        if not value:
            return []
        return [item.strip() for item in value.split(',')]
	
class UserNewProject(forms.Form):
	name_ssp = forms.CharField(label="Nombre Soft System Project", widget=forms.TextInput(), required=True)
	description_ssp = forms.CharField(label="Descripcion Soft System Project", widget=forms.Textarea, required=True)
	privacy_ssp = forms.ChoiceField(label="Privacidad", choices=PRIVACY)

class ProjectAddContrib(forms.Form):
	contrib_username = forms.CharField(label="Nombre de Usuario Colaborador", widget=forms.TextInput(), required=True)