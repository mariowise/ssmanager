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
		<td><code>/api/v1/messages/:message_id</code></td>
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


Notification
------------

#### Estructura JSON

	{
		id: Integer,
		creador_notificacion: Integer,
		imagen_notificacion: String,
		accion_notificacion: String,
		url_notificacion: String,
		date_notificacion: String, 
		users_noRead_notificacion: Array,
		id_asoc_notificacion: Integer,
		type_notificacion: String
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
		<td><code>/api/v1/notifications</code></td>
		<td>List</td>
		<td><code>Array</code></td>
		<td></td>
	</tr>
	<tr>
		<td><code>GET</code></td>
		<td><code>/api/v1/notifications/:notification_id</code></td>
		<td>Show</td>
		<td><code>Object</code></td>
		<td></td>
	</tr>
	<tr>
		<td><code>POST</code></td>
		<td><code>/api/v1/notifications/:notification_id</code></td>
		<td>Create</td>
		<td><code>Object</code></td>
		<td></td>
	</tr>
	<tr>
		<td><code>PATCH</code></td>
		<td><code>/api/v1/notifications/:notification_id</code></td>
		<td>Update</td>
		<td><code>Object</code></td>
		<td></td>
	</tr>
	<tr>
		<td><code>DELETE</code></td>
		<td><code>/api/v1/notifications/:notification_id</code></td>
		<td>Delete</td>
		<td><code>null</code></td>
		<td></td>
	</tr>
</table>


Profile
-------

#### Estructura JSON

	{
		id: Integer,
		user: Integer,
		email_public_user: String,
		url_user: String,
		company_user: String,
		position_user: String,
		mWeb_user: String,
		mEmail_user: String,
		photo_user: String,
		photo_url: String,
		project_colab_user: Array,
		id_folder_user: String,
		mensajes_user_leidos: Array,
		mensajes_user_noleidos: Array,
		id_drive_folder: String
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
		<td><code>/api/v1/profiles</code></td>
		<td>List</td>
		<td><code>Array</code></td>
		<td></td>
	</tr>
	<tr>
		<td><code>GET</code></td>
		<td><code>/api/v1/profiles/:profile_id</code></td>
		<td>Show</td>
		<td><code>Object</code></td>
		<td></td>
	</tr>
	<tr>
		<td><code>POST</code></td>
		<td><code>/api/v1/profiles/:profile_id</code></td>
		<td>Create</td>
		<td><code>Object</code></td>
		<td></td>
	</tr>
	<tr>
		<td><code>PATCH</code></td>
		<td><code>/api/v1/profiles/:profile_id</code></td>
		<td>Update</td>
		<td><code>Object</code></td>
		<td></td>
	</tr>
	<tr>
		<td><code>DELETE</code></td>
		<td><code>/api/v1/profiles/:profile_id</code></td>
		<td>Delete</td>
		<td><code>null</code></td>
		<td></td>
	</tr>
</table>


Project
-------

#### Estructura JSON

	{
		id: Integer,
		manager: String, 
		name_ssp: String,
		description_ssp: String,
		date_spp: String,
		id_folder_ssp: String,
		contribs_ssp: Array,
		notificaciones_ssp: Array,
		ids_folder_ssp: String,
		state_two: Object,
		state_three: Object,
		contribs: Array
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
		<td><code>/api/v1/projects</code></td>
		<td>List</td>
		<td><code>Array</code></td>
		<td></td>
	</tr>
	<tr>
		<td><code>GET</code></td>
		<td><code>/api/v1/projects/:project_id</code></td>
		<td>Show</td>
		<td><code>Object</code></td>
		<td></td>
	</tr>
	<tr>
		<td><code>POST</code></td>
		<td><code>/api/v1/projects/:project_id</code></td>
		<td>Create</td>
		<td><code>Object</code></td>
		<td></td>
	</tr>
	<tr>
		<td><code>PATCH</code></td>
		<td><code>/api/v1/projects/:project_id</code></td>
		<td>Update</td>
		<td><code>Object</code></td>
		<td></td>
	</tr>
	<tr>
		<td><code>DELETE</code></td>
		<td><code>/api/v1/projects/:project_id</code></td>
		<td>Delete</td>
		<td><code>null</code></td>
		<td></td>
	</tr>
	<tr>
		<td><code>POST</code></td>
		<td><code>/api/v1/projects/:project_id/invite_contrib</code></td>
		<td>Invite contrib</td>
		<td><code>null</code></td>
		<td><code>user_id</code></td>
	</tr>
	<tr>
		<td><code>POST</code></td>
		<td><code>/api/v1/projects/:project_id/rm_contrib</code></td>
		<td>Remove contrib</td>
		<td><code>null</code></td>
		<td><code>username</code></td>
	</tr>
	<tr>
		<td><code>GET</code></td>
		<td><code>/api/v1/projects/:project_id/contribs</code></td>
		<td>Contribs</td>
		<td><code>Array</code></td>
		<td></td>
	</tr>
	<tr>
		<td><code>GET</code></td>
		<td><code>/api/v1/projects/:project_id/state_three</code></td>
		<td>State three</td>
		<td><code>Object</code></td>
		<td></td>
	</tr>
</table>


Rich-picture
------------

#### Estructura JSON

	{
		id: Integer,
		name_rp: String,
		description_rp: String,
		analisis_rp: String,
		documentos_rp: String,
		richPFinal_rp: String,
		comments_rp: Array,
		created_by: String,
		date_rp: String,
		comments: Array
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
		<td><code>/api/v1/richpictures</code></td>
		<td>List</td>
		<td><code>Array</code></td>
		<td></td>
	</tr>
	<tr>
		<td><code>GET</code></td>
		<td><code>/api/v1/richpictures/:richpicture_id</code></td>
		<td>Show</td>
		<td><code>Object</code></td>
		<td></td>
	</tr>
	<tr>
		<td><code>POST</code></td>
		<td><code>/api/v1/richpictures/:richpicture_id</code></td>
		<td>Create</td>
		<td><code>Object</code></td>
		<td></td>
	</tr>
	<tr>
		<td><code>PATCH</code></td>
		<td><code>/api/v1/richpictures/:richpicture_id</code></td>
		<td>Update</td>
		<td><code>Object</code></td>
		<td></td>
	</tr>
	<tr>
		<td><code>DELETE</code></td>
		<td><code>/api/v1/richpictures/:richpicture_id</code></td>
		<td>Delete</td>
		<td><code>null</code></td>
		<td></td>
	</tr>
</table>


Root definition
---------------

#### Estructura JSON

	{
		id: Integer,
		name_DR: String,
		description_DR: String,
		created_by: String,
		date_DR: String
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
		<td><code>/api/v1/root_definition</code></td>
		<td>List</td>
		<td><code>Array</code></td>
		<td></td>
	</tr>
	<tr>
		<td><code>GET</code></td>
		<td><code>/api/v1/root_definition/:root_definition_id</code></td>
		<td>Show</td>
		<td><code>Object</code></td>
		<td></td>
	</tr>
	<tr>
		<td><code>POST</code></td>
		<td><code>/api/v1/root_definition/:root_definition_id</code></td>
		<td>Create</td>
		<td><code>Object</code></td>
		<td></td>
	</tr>
	<tr>
		<td><code>PATCH</code></td>
		<td><code>/api/v1/root_definition/:root_definition_id</code></td>
		<td>Update</td>
		<td><code>Object</code></td>
		<td></td>
	</tr>
	<tr>
		<td><code>DELETE</code></td>
		<td><code>/api/v1/root_definition/:root_definition_id</code></td>
		<td>Delete</td>
		<td><code>null</code></td>
		<td></td>
	</tr>
</table>


Catwoe
------

#### Estructura JSON

	{
		id: Integer,
		name_dr: String,
		description_dr: String,
		definiciones_dr: String,
		definicionFinal_dr: String,
		richPicture_dr: String,
		clientes_dr: String,
		actores_dr: String,
		trans_input_dr: String,
		trans_output_dr: String,
		cosmo_dr: String,
		propietario_dr: String,
		entorno_dr: String,
		comments_dr: Array,
		created_by: String,
		date_dr: String,
		comments: Array,
		roots: Array
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
		<td><code>/api/v1/root_definition_catwoe</code></td>
		<td>List</td>
		<td><code>Array</code></td>
		<td></td>
	</tr>
	<tr>
		<td><code>GET</code></td>
		<td><code>/api/v1/root_definition_catwoe/:catwoe_id</code></td>
		<td>Show</td>
		<td><code>Object</code></td>
		<td></td>
	</tr>
	<tr>
		<td><code>POST</code></td>
		<td><code>/api/v1/root_definition_catwoe/:catwoe_id</code></td>
		<td>Create</td>
		<td><code>Object</code></td>
		<td><code>state_id</code></td>
	</tr>
	<tr>
		<td><code>PATCH</code></td>
		<td><code>/api/v1/root_definition_catwoe/:catwoe_id</code></td>
		<td>Update</td>
		<td><code>Object</code></td>
		<td></td>
	</tr>
	<tr>
		<td><code>DELETE</code></td>
		<td><code>/api/v1/root_definition_catwoe/:catwoe_id</code></td>
		<td>Delete</td>
		<td><code>null</code></td>
		<td></td>
	</tr>
</table>


State one
---------

#### Estructura JSON

	{
		id: Integer,
		ssp_stateOne: Integer,
		ssp_videos: Array,
		ssp_imagenes: Array,
		ssp_audios: Array,
		ssp_documentos: Array,
		ssp_analisis: Array,
		tags_state: Array
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
		<td><code>/api/v1/state_one</code></td>
		<td>List</td>
		<td><code>Array</code></td>
		<td></td>
	</tr>
	<tr>
		<td><code>GET</code></td>
		<td><code>/api/v1/state_one/:state_id</code></td>
		<td>Show</td>
		<td><code>Object</code></td>
		<td></td>
	</tr>
	<tr>
		<td><code>POST</code></td>
		<td><code>/api/v1/state_one/:state_id</code></td>
		<td>Create</td>
		<td><code>Object</code></td>
		<td><code>state_id</code></td>
	</tr>
	<tr>
		<td><code>PATCH</code></td>
		<td><code>/api/v1/state_one/:state_id</code></td>
		<td>Update</td>
		<td><code>Object</code></td>
		<td></td>
	</tr>
	<tr>
		<td><code>DELETE</code></td>
		<td><code>/api/v1/state_one/:state_id</code></td>
		<td>Delete</td>
		<td><code>null</code></td>
		<td></td>
	</tr>
	<tr>
		<td><code>POST</code></td>
		<td><code>/api/v1/state_one/:state_id/delete_tag</code></td>
		<td>Delete tag</td>
		<td><code>Object</code></td>
		<td><code>tag_id</code></td>
	</tr>
	<tr>
		<td><code>POST</code></td>
		<td><code>/api/v1/state_one/:state_id/delete_media</code></td>
		<td>Delete media</td>
		<td><code>Object</code></td>
		<td><code>media_id</code></td>
	</tr>
</table>


State two
---------

#### Estructura JSON

	{
		id: Integer,
		ssp_stateTwo: Integer,
		ssp_richPictures: Array
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
		<td><code>/api/v1/state_two</code></td>
		<td>List</td>
		<td><code>Array</code></td>
		<td></td>
	</tr>
	<tr>
		<td><code>GET</code></td>
		<td><code>/api/v1/state_two/:state_id</code></td>
		<td>Show</td>
		<td><code>Object</code></td>
		<td></td>
	</tr>
	<tr>
		<td><code>POST</code></td>
		<td><code>/api/v1/state_two/:state_id</code></td>
		<td>Create</td>
		<td><code>Object</code></td>
		<td><code>state_id</code></td>
	</tr>
	<tr>
		<td><code>PATCH</code></td>
		<td><code>/api/v1/state_two/:state_id</code></td>
		<td>Update</td>
		<td><code>Object</code></td>
		<td></td>
	</tr>
	<tr>
		<td><code>DELETE</code></td>
		<td><code>/api/v1/state_two/:state_id</code></td>
		<td>Delete</td>
		<td><code>null</code></td>
		<td></td>
	</tr>
</table>


State three
-----------

#### Estructura JSON

	{
		id: Integer,
		ssp_stateThree: String,
		ssp_definicionesRaices: Array,
		catwoes: Array
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
		<td><code>/api/v1/state_three</code></td>
		<td>List</td>
		<td><code>Array</code></td>
		<td></td>
	</tr>
	<tr>
		<td><code>GET</code></td>
		<td><code>/api/v1/state_three/:state_id</code></td>
		<td>Show</td>
		<td><code>Object</code></td>
		<td></td>
	</tr>
	<tr>
		<td><code>POST</code></td>
		<td><code>/api/v1/state_three/:state_id</code></td>
		<td>Create</td>
		<td><code>Object</code></td>
		<td><code>state_id</code></td>
	</tr>
	<tr>
		<td><code>PATCH</code></td>
		<td><code>/api/v1/state_three/:state_id</code></td>
		<td>Update</td>
		<td><code>Object</code></td>
		<td></td>
	</tr>
	<tr>
		<td><code>DELETE</code></td>
		<td><code>/api/v1/state_three/:state_id</code></td>
		<td>Delete</td>
		<td><code>null</code></td>
		<td></td>
	</tr>
</table>


Tag
---

#### Estructura JSON

	{
		id: Integer,
		name_tag: String,
		description_tag: String 
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
		<td><code>/api/v1/tags</code></td>
		<td>List</td>
		<td><code>Array</code></td>
		<td></td>
	</tr>
	<tr>
		<td><code>GET</code></td>
		<td><code>/api/v1/tags/:tag_id</code></td>
		<td>Show</td>
		<td><code>Object</code></td>
		<td></td>
	</tr>
	<tr>
		<td><code>POST</code></td>
		<td><code>/api/v1/tags/:tag_id</code></td>
		<td>Create</td>
		<td><code>Object</code></td>
		<td><code>state_one_id</code></td>
	</tr>
	<tr>
		<td><code>PATCH</code></td>
		<td><code>/api/v1/tags/:tag_id</code></td>
		<td>Update</td>
		<td><code>Object</code></td>
		<td></td>
	</tr>
	<tr>
		<td><code>DELETE</code></td>
		<td><code>/api/v1/tags/:tag_id</code></td>
		<td>Delete</td>
		<td><code>null</code></td>
		<td></td>
	</tr>
</table>


Users
-----

#### Estructura JSON

	{
		id: Integer,
		username: String, 
		first_name: String, 
		last_name: String, 
		email: String
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
		<td><code>/api/v1/users</code></td>
		<td>List</td>
		<td><code>Array</code></td>
		<td></td>
	</tr>
	<tr>
		<td><code>GET</code></td>
		<td><code>/api/v1/users/:user_id</code></td>
		<td>Show</td>
		<td><code>Object</code></td>
		<td></td>
	</tr>
	<tr>
		<td><code>POST</code></td>
		<td><code>/api/v1/users/:user_id</code></td>
		<td>Create</td>
		<td><code>Object</code></td>
		<td></td>
	</tr>
	<tr>
		<td><code>PATCH</code></td>
		<td><code>/api/v1/users/:user_id</code></td>
		<td>Update</td>
		<td><code>Object</code></td>
		<td></td>
	</tr>
	<tr>
		<td><code>DELETE</code></td>
		<td><code>/api/v1/users/:user_id</code></td>
		<td>Delete</td>
		<td><code>null</code></td>
		<td></td>
	</tr>
	<tr>
		<td><code>POST</code></td>
		<td><code>/api/v1/users/changepass</code></td>
		<td>Change password</td>
		<td><code>Object</code></td>
		<td><code>oldpassword</code>, <code>newpassword</code></td>
	</tr>
	<tr>
		<td><code>GET</code></td>
		<td><code>/api/v1/users/colabs</code></td>
		<td>Colabs</td>
		<td><code>Array</code></td>
		<td></td>
	</tr>
</table>

