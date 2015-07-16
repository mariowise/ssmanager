[< Volver](https://github.com/mariowise/ssmanager/tree/master/mobile)

API REST
=====

La API REST se encuentra construida bajo el framework `django-rest-framework` y trabaja la autenticación mediante la tecnología `JWT`. Es por esto que para poder consumir cualquiera de sus métodos es necesario contar con un `token` válido.

Autenticación
-------

Para conseguir un token es necesario efectuar una petición `POST` que contenga tanto el `username` y la `password` de un usuario registrado en el sistema.

    curl --data "username=[USERNAME]&password=[PASSWORD]" http://softsystemanager.appspot.com/api/v1/auth/

La respuesta es un objeto `JSON` que contiene el token

	{
		"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1hcmlvd2lzZSIsIm9yaWdfaWF0IjoxNDM2OTk5OTgzLCJ1c2VyX2lkIjo1NzY5NzIwODIxMTg2NTYwLCJlbWFpbCI6Im1hcmlvbG9wZXpsYW5kZXNAZ21haWwuY29tIiwiZXhwIjoxNDQ3MzY3OTgzfQ.zrTaIHiOIZaUrPv9efX88r3i49FWxql76Qejw_Fj3mM"
	}

El `token` puede ser decodificado contienendo la siguiente estructura

	{
		"username": "mariowise",               // Nombre de usuario
		"orig_iat": 1436999983,                // Timestamp de creación 
		"user_id": XXXXXXXXXXXXXXX,            // id del usuario en el sistema
		"email": "mariolopezlandes@gmail.com", // correo electrónico
		"exp": 1447367983                      // Timestamp de expiración
	}

**Todo token puede ser renovado a partir de un token válido**, mediante una petición `POST` de la siguiente forma

	curl --data "token=[CURRENT_TOKEN]&orig_iat=[ORIG_IAT]" http://softsystemanager.appspot.com/api/v1/token-refresh/

Lo cual entrega un nuevo token renovado, bajo la misma estructura del primero.

* **Solo un token válido puede renovar el token**
* Un token expirado requiere proveer credenciales de acceso nuevamente.
* Todo Timestamp es construido por el servidor bajo su hora local.

Toda petición a la API debe contener una cabecera presentando el token del usuario que esta efectuando la operación. 

	Authorization: JWT eyJhbGCiOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1hcmlvd2lzZSIsIm9yaWdfaWF0IjoxNDM0NTAwMTczLCJ1c2VyX2lkIjo1NzY5NzIwODIxMTg2NTYwLCJlbWFpbCI6Im1hcmlvQHJlcXVpZXMuY2wiLCJleHAiOjE0NDQ4NjgxNzN9.pA824jf2eudn_IaxsD8zT_OoFM2ObdwvY4i3iiRgTas

Project
-------

#### List

	POST /api/v1/projects

#### Show

	GET /api/v1/projects/:project_id

#### Create

	POST /api/v1/projects

#### Update

	PATCH /api/v1/projects/:project_id 

#### Delete

	DELETE /api/v1/projects/:project_id

#### Invite contrib

Recibe mediante formulario el dato `user_id` que lleva el **id** del usuario que esta siendo incluido como contribuyente al proyecto.

	POST /api/v1/projects/:project_id/invite_contrib

#### Remove contrib

Recibe mediante formulario el dato `user_id` que lleva el **id** del usuario que esta siendo eliminado como contribuyente del proyecto.

	POST /api/v1/projects/:project_id/rm_contrib

#### Contribs

Entrega la lista de usuarios que son contribuyentes en un proyecto

	GET /api/v1/projects/:project_id/constribs

#### State three

Entrega el estadio 3 del proyecto `:project_id`

	GET /api/v1/projects/:project_id/state_three



