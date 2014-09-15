from random import choice

def randomPassword():
	longitud = 18
	valores = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ<=>@#%&+"

	p = ""
	p = p.join([choice(valores) for i in range(longitud)])
	return p