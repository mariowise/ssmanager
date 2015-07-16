[< Volver](https://github.com/mariowise/ssmanager/tree/master/mobile)

API REST
=====

La API REST se encuentra construida bajo el framework `django-rest-framework` y trabaja la autenticación mediante la tecnología `JWT`. Es por esto que para poder consumir cualquiera de sus métodos es necesario contar con un `token` válido.

Autenticación
-------------

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


Analisys
--------

#### Estructura JSON

	{
		id: Integer
		name_analisis: String
		description_analisis: String
		links_analisis: Array
		comments_analisis: Array
		tags_analisis: Array
		created_by: String
		date_analisis: String
		documents: Array
		comments: Array
		tag: Array
    }

#### Métodos

<table>
	<tr>
		<th>Verbo</th>
		<th>Ruta</th>
		<th>Método</th>
		<th>Tipo de dato</th>
		<th>Parámetros extra</th>
	</tr>

	<tr>
		<td><pre>POST</pre></td>
		<td><pre>/api/v1/analisys</pre></td>
		<td>List</td>
		<td><pre>Array</pre></td>
		<td></td>
	</tr>
	<tr>
		<td><pre>GET</pre></td>
		<td><pre>/api/v1/analisys/:analisys_id</pre></td>
		<td>Show</td>
		<td><pre>Object</pre></td>
		<td></td>
	</tr>
	<tr>
		<td><pre>POST</pre></td>
		<td><pre>/api/v1/analisys/:analisys_id</pre></td>
		<td>Create</td>
		<td><pre>Object</pre></td>
		<td></td>
	</tr>
	<tr>
		<td><pre>PATCH</pre></td>
		<td><pre>/api/v1/analisys/:analisys_id</pre></td>
		<td>Update</td>
		<td><pre>Object</pre></td>
		<td></td>
	</tr>
	<tr>
		<td><pre>DELETE</pre></td>
		<td><pre>/api/v1/analisys/:analisys_id</pre></td>
		<td>Delete</td>
		<td><pre>null</pre></td>
		<td></td>
	</tr>
	<tr>
		<td><pre>POST</pre></td>
		<td><pre>/api/v1/analisys/:analisys_id/add_tag</pre></td>
		<td>Add tag</td>
		<td><pre>Object</pre></td>
		<td><pre>tag_id</pre></td>
	</tr>
	<tr>
		<td><pre>POST</pre></td>
		<td><pre>/api/v1/analisys/:analisys_id/rm_tag</pre></td>
		<td>Remove tag</td>
		<td><pre>Object</pre></td>
		<td><pre>tag_id</pre></td>
	</tr>
</table>


Comments
--------

#### List

	POST /api/v1/comments

#### Show

	GET /api/v1/comments/:comment_id

#### Create

Dependiendo de sobre que objeto es creado el comentario debe incluir el campo de formulario `media_id` || `catwoe_id` || `picture_id` || `analisys_id`.

	POST /api/v1/comments

#### Update

	PATCH /api/v1/comments/:comment_id 

#### Delete

	DELETE /api/v1/comments/:comment_id


Documents
---------

#### List

	POST /api/v1/documents

#### Show

	GET /api/v1/documents/:document_id

#### Create

	POST /api/v1/documents

#### Update

	PATCH /api/v1/documents/:document_id 

#### Delete

	DELETE /api/v1/documents/:document_id


