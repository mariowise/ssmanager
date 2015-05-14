from random import choice
from google.appengine.api import mail
def randomPassword():
	longitud = 18
	valores = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ<=>@#%&+"

	p = ""
	p = p.join([choice(valores) for i in range(longitud)])
	return p

def enviarCorreoRecover(email, newPassword):

	message = mail.EmailMessage(sender="Soft System Manager <arden.papifunk@gmail.com>",
		subject="Cambio de Password")

	message.to = email
	message.body = """Estimado:

	Tu Password ha sido actualizada para que puedas ingresar a Soft System Manager
	, te recomendamos cambiarla inmediatamente por una sencilla:

	Nuevo password: %s

	Saludos	!!!!"""%(newPassword)


	message.send()