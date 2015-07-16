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


Analisys
--------

#### Estructura JSON

	{
		id: Integer,
		name_analisis: String,
		description_analisis: String,
		links_analisis: Array,
		comments_analisis: Array,
		tags_analisis: Array,
		created_by: String,
		date_analisis: String,
		documents: Array,
		comments: Array,
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
		<td><code>POST</code></td>
		<td><code>/api/v1/analisys</code></td>
		<td>List</td>
		<td><code>Array</code></td>
		<td></td>
	</tr>
	<tr>
		<td><code>GET</code></td>
		<td><code>/api/v1/analisys/:analisys_id</code></td>
		<td>Show</td>
		<td><code>Object</code></td>
		<td></td>
	</tr>
	<tr>
		<td><code>POST</code></td>
		<td><code>/api/v1/analisys/:analisys_id</code></td>
		<td>Create</td>
		<td><code>Object</code></td>
		<td></td>
	</tr>
	<tr>
		<td><code>PATCH</code></td>
		<td><code>/api/v1/analisys/:analisys_id</code></td>
		<td>Update</td>
		<td><code>Object</code></td>
		<td></td>
	</tr>
	<tr>
		<td><code>DELETE</code></td>
		<td><code>/api/v1/analisys/:analisys_id</code></td>
		<td>Delete</td>
		<td><code>null</code></td>
		<td></td>
	</tr>
	<tr>
		<td><code>POST</code></td>
		<td><code>/api/v1/analisys/:analisys_id/add_tag</code></td>
		<td>Add tag</td>
		<td><code>Object</code></td>
		<td><code>tag_id</code></td>
	</tr>
	<tr>
		<td><code>POST</code></td>
		<td><code>/api/v1/analisys/:analisys_id/rm_tag</code></td>
		<td>Remove tag</td>
		<td><code>Object</code></td>
		<td><code>tag_id</code></td>
	</tr>
</table>


Comments
--------

#### Estructura JSON

	{
		id: Integer,
		autor_comentary: Integer,
		date_comentary: String,
		content_comentary: String,
		user: Object
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
		<td><code>POST</code></td>
		<td><code>/api/v1/comments</code></td>
		<td>List</td>
		<td><code>Array</code></td>
		<td></td>
	</tr>
	<tr>
		<td><code>GET</code></td>
		<td><code>/api/v1/comments/:comment_id</code></td>
		<td>Show</td>
		<td><code>Object</code></td>
		<td></td>
	</tr>
	<tr>
		<td><code>POST</code></td>
		<td><code>/api/v1/comments/:comment_id</code></td>
		<td>Create</td>
		<td><code>Object</code></td>
		<td><code>media_id</code> o <code>catwoe_id</code> o <code>picture_id</code> o <code>analisys_id</code></td>
	</tr>
	<tr>
		<td><code>PATCH</code></td>
		<td><code>/api/v1/comments/:comment_id</code></td>
		<td>Update</td>
		<td><code>Object</code></td>
		<td></td>
	</tr>
	<tr>
		<td><code>DELETE</code></td>
		<td><code>/api/v1/comments/:comment_id</code></td>
		<td>Delete</td>
		<td><code>null</code></td>
		<td></td>
	</tr>
</table>


Documents
---------

#### Estructura JSON

	{
		id: Integer,
		name_documento: String,
		url_documento: String,
		shared_documento: String,
		date_documento: String,
		google_id: String
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
		<td><code>POST</code></td>
		<td><code>/api/v1/documents</code></td>
		<td>List</td>
		<td><code>Array</code></td>
		<td></td>
	</tr>
	<tr>
		<td><code>GET</code></td>
		<td><code>/api/v1/documents/:document_id</code></td>
		<td>Show</td>
		<td><code>Object</code></td>
		<td></td>
	</tr>
	<tr>
		<td><code>POST</code></td>
		<td><code>/api/v1/documents/:document_id</code></td>
		<td>Create</td>
		<td><code>Object</code></td>
		<td></td>
	</tr>
	<tr>
		<td><code>PATCH</code></td>
		<td><code>/api/v1/documents/:document_id</code></td>
		<td>Update</td>
		<td><code>Object</code></td>
		<td></td>
	</tr>
	<tr>
		<td><code>DELETE</code></td>
		<td><code>/api/v1/documents/:document_id</code></td>
		<td>Delete</td>
		<td><code>null</code></td>
		<td></td>
	</tr>
</table>


Media
-----

#### Estructura JSON

	{
		id: Integer,
		name_media: String,
		description_media: String,
		url_media: String,
		uploaded_by: String,
		date_media: String,
		type_media: String,
		comments_media: Array,
		tags_media: Array,
		comments: Array,
		tags: Array
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
		<td><code>POST</code></td>
		<td><code>/api/v1/media</code></td>
		<td>List</td>
		<td><code>Array</code></td>
		<td></td>
	</tr>
	<tr>
		<td><code>GET</code></td>
		<td><code>/api/v1/media/:media_id</code></td>
		<td>Show</td>
		<td><code>Object</code></td>
		<td></td>
	</tr>
	<tr>
		<td><code>POST</code></td>
		<td><code>/api/v1/media/:media_id</code></td>
		<td>Create</td>
		<td><code>Object</code></td>
		<td></td>
	</tr>
	<tr>
		<td><code>PATCH</code></td>
		<td><code>/api/v1/media/:media_id</code></td>
		<td>Update</td>
		<td><code>Object</code></td>
		<td></td>
	</tr>
	<tr>
		<td><code>DELETE</code></td>
		<td><code>/api/v1/media/:media_id</code></td>
		<td>Delete</td>
		<td><code>null</code></td>
		<td></td>
	</tr>
	<tr>
		<td><code>POST</code></td>
		<td><code>/api/v1/media/:media_id/add_tag</code></td>
		<td>Add tag</td>
		<td><code>Object</code></td>
		<td><code>tag_id</code></td>
	</tr>
	<tr>
		<td><code>POST</code></td>
		<td><code>/api/v1/media/:media_id/rm_tag</code></td>
		<td>Remove tag</td>
		<td><code>Object</code></td>
		<td><code>tag_id</code></td>
	</tr>
</table>


Message
-------

#### Estructura JSON

	{
		id: Integer,
		remitente_mensaje: Integer,
		receptores_mensaje: Array,
		asunto_mensaje: String,
		contenido_mensaje: String,
		date_mensaje: String,
		proyecto_mensaje: Integer,
		url_asoc_mensaje: String,
		receptores: Array,
		remitente: Object
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
		<td><code>POST</code></td>
		<td><code>/api/v1/messages</code></td>
		<td>List</td>
		<td><code>Array</code></td>
		<td></td>
	</tr>
	<tr>
		<td><code>GET</code></td>
		<td><code>/api/v1/messages/:media_id</code></td>
		<td>Show</td>
		<td><code>Object</code></td>
		<td></td>
	</tr>
	<tr>
		<td><code>POST</code></td>
		<td><code>/api/v1/messages/:message_id</code></td>
		<td>Create</td>
		<td><code>Object</code></td>
		<td></td>
	</tr>
	<tr>
		<td><code>PATCH</code></td>
		<td><code>/api/v1/messages/:message_id</code></td>
		<td>Update</td>
		<td><code>Object</code></td>
		<td></td>
	</tr>
	<tr>
		<td><code>DELETE</code></td>
		<td><code>/api/v1/messages/:message_id</code></td>
		<td>Delete</td>
		<td><code>null</code></td>
		<td></td>
	</tr>
</table>