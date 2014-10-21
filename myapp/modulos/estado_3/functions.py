# -*- encoding: utf-8 -*-
from myapp.modulos.estado_3.models import DefinicionRaizCATWOE

def propuestaDefinicionRaiz(id_dr):
	definicionRaiz = DefinicionRaizCATWOE.objects.get(id=id_dr)
	propuesta = ""
	if definicionRaiz.clientes_dr is not None and \
		definicionRaiz.actores_dr is not None and \
		definicionRaiz.trans_input_dr is not None and \
		definicionRaiz.trans_output_dr is not None and \
		definicionRaiz.cosmo_dr is not None and \
		definicionRaiz.propietario_dr is not None and \
		definicionRaiz.entorno_dr:


		propuesta = "Un sistema de actividad humano que hace la transformacion de << %s >> en << %s >> realizado por << %s >> que permite que se beneficien << %s >> y, como consecuencia, las victimas son << %s >>. Los propietarios << %s >> son los que pueden impedir que se realice la transformacion de << %s >> en << %s >> en un entorno << %s >>. La transformacion de << %s >> en << %s >> se justifica y es significativa fruto de la vision de mundo << %s >>."%(definicionRaiz.trans_input_dr, definicionRaiz.trans_output_dr, definicionRaiz.actores_dr, definicionRaiz.clientes_dr, 
			definicionRaiz.clientes_dr, definicionRaiz.propietario_dr, definicionRaiz.trans_input_dr, definicionRaiz.trans_output_dr, 
			definicionRaiz.entorno_dr, definicionRaiz.trans_input_dr, definicionRaiz.trans_output_dr, definicionRaiz.cosmo_dr)

		return propuesta
	else:
		return None