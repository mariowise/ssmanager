[< Volver](https://github.com/mariowise/ssmanager/tree/master/mobile)

Services
========

Los servicios son clases que heredan de la clase `Resource`, y por lo tanto, poseen todos
métodos de la clase `Local` y `Resource`. De forma adicional, incluyen sus propios métodos.

Los métodos que son definidos como una extensión del recurso, son procedimientos que realiza
la capa servicios como parte de la lógica de negocios. 

	var Recurso = Resource(....)

	Recurso.method = function () ....

Por otro lado los métodos definidos dentro de la creación del recurso son métodos que 
consultan directamente ruta en la API REST.

	var Recurso = Resource(......, {
		method: {
			type: "POST",
			url: CONFIG.api("recurso") + "/:id/metodo"
		}
	})

A continuación se definen todos los métodos de la clase servicios, sus parámetros, sus valores
de retorno y una breve descripción de que es lo que hacen.


Analisys (Resource)
------

#### add_tag(key)

* param `key`: Object
* return `promise`

Recibe un objeto que debe contener un `id` y un `tag_id` como Number para
agregar una etiqueta al análisis

#### rm_tag(key)

* param `key`: Object
* return `promise`

Recibe un objeto que debe contener un `id` y un `tag_id` como Number para
eliminar una etiqueta del análisis análisis

#### fetchOne(Resource::find)


Catwoe (Resource)
------

#### fetchOne(Resource::find)


Comment (Resource)
------

#### fetchOne(Resource::find)


Document (Resource)
------

#### fetchOne(key)

* param `key`: Object, Array o Number
* return `promise`

Descarga la imagen del documento en función a la URL `https://docs.google.com/feeds/download/drawings/Export?id=[ID_DOCUMENT]`.
Para que tenga exito, el documento debe tener **permisos de lectura a quien posea el link**.
La imágen queda almacenada en el dispositivo en la carpeta `media`.

File (Resource)
------

#### takePhoto()

* return `promise`

Configura y toma una foto, retornando la promesa de cuando termine la captura


#### takeAudio()

* return `promise`

Captura audio y retorna la ubicación donde queda almacenado en el dispositivo. Esta
configurado para capturar solo 1 audio y con una duración máxima de 1 hora.


#### takeVideo()

* return `promise`

Captura video y retorna la ubicación donde queda almacenado l archivo. Esta configurado
para capturar 1 archivo de video y con una duración máxima de 15 minutos.


#### selectPhoto()

* return `promise`

Permite elegir un archivo desde la biblioteca de photos. La selección es editada
para conseguir una imagen de 800x800, y el resultado no es almacenado en la 
biblioteca del dispositivo, solo en el `sandbox` de la aplicación.


#### upload(fileUri, url, opt)

* param `fileUri`: Corresponde a la ruta local al dispositivo donde esta el archivo que se quiere subir.
* param `url`: Corresponde a la ruta en internet donde se quiere subir el fichero.
* param `opt`: (Optional) Corresponde al objeto de opciones que es pasado al módulo $cordovaFileTransfer
* return `promise`

Efectúa la operación de subir un fichero a la nube, devuelve la promesa de esta operación


#### download(fileUrl, fname)

* param `fileUrl`: Corresponde a la URL en internet donde se debe obtener el archivo a eliminar
* param `fname`: (Optional) Corresponde al nombre con el que se quiere guardar el archivo. En caso de no proveerlo, intenta encontrarlo dentro de la URL
* return `promise`

A partir de una URL si no existe cordova resuelve la misma URL, en caso contrario, 
revisa si es que se encuentra disponible en el dispositivo el archivo. Si se encuentra, retorna su 
URI, en caso contrario, comienza la transferencia para descargarlo, resolviendo con su URI fresca.
Si ocurre algún error con la descarga, rechaza la promsea. Es importante notar que para
que este método funcione, es necesario que exista la carpeta `media` el la carpeta de almacenamiento (rw)
del dispositivo; esta configuración se realiza a la hora de iniciar la aplicación (app.js)

#### clean(rPath)

* param `rPath`: Corresponde a la ruta local del dispositivo que se quiere limpiar.
* return `promise`

Vacía la carpeta rPath ubicada dentro del directorio de documentos asignado a la App por
el sistema operativo


Has (Resource)
------

#### remove(Object)

* param `Object`: Diccionario que contiene el `id` del HAS a eliminar y el `catwoe_id`
* return `promise`

Elimina un HAS de un CATWOE


Media (Resource)
------

#### add_tag(Object)

* param `Object`: Diccionario que contiene el `id` del media y el `tag_id` de la etiqueta.
* return `promise`

Agrega una etiqueta a un Media.


#### rm_tag(Object)

* param `Object`: Diccionario que contiene el `id` del media y el `tag_id` de la etiqueta.
* return `promise`

Elimina una etiqueta de un Media.

#### addComment(media, msg)

* param `media`: Objecto Media
* param `msg`: Objeto Comentary
* return `promise`

Agrega un comentario a una media
Consulta además el current_user para registrar el autor del comentario
retorna la media actualizada con el comentario dentro.
#### fetchOne

* param `key`: Object, String o Number

Efectúa un find y además descarga el archivo si es que no existe


#### pushOne(key)

* param `key`: Object, String o Number
* return `promise`

Si es que la tupla local posee la bandera __syncPending, entonces 

#### create(newMedia)

* param `newMedia`: Object
* return `promise`

Sobreescribe el método create de `Resource`. Para este caso incluye además la columna de `uploaded_by`
y la fecha `date_media`. Si no tiene internet para lograr la operación, lo almacenad de forma local
declarando además la bandera `__syncPending` dentro del objeto.


Message (Resource)
------

#### mark_message(Object)

* param `Object`: Diccionario que contiene el `id` mensaje 
* return `promise`

Marca un mensaje no leído como leído.


#### count()

* return `promise`

Obtiene la cantidad de mensaje no leídos que tiene el usuario.


#### fetchOne(Resource::find)


Profile (Resource)
------

#### fetchOne(Resource::find)


#### fetchMessages(key)

* param `key`: Object o Number
* return `promise`

Obtiene el perfil y además todos los mensajes leídos y no leídos. Construye
un objeto enbebido y además actualiza en la tabla Message (replicado).


Project (Resource)
------

#### invite_contrib(Object)

* param `Object`: Diccionario que contiene el `id` del proyecto y el `user_id` del usuario que esta siendo invitado.
* return `promise`

Envía una invitación a un usuario para incluirlo como colaborador de un proyecto.


#### rm_contrib(Object)

* param `Object`: Diccionario que contiene el `id` del proyecto y el `user_id` del usuario que esta siendo desvinculado.
* return `promise`

Permite desvincular a un usuario de un proyecto.


#### state_three(Object)

* param `Object`: Diccionario que contiene el `id` del proyecto
* return `promise`

Obtiene el Estadio 3 de un proyecto.


#### pull(Object)

* return `promise`

Descarga todos los proyectos en donde el usuario colabora y además todos 
aquellos en donde es manager


#### fetchOne(key)

* param `key`: Object o Number 
* return `promise`

Descarga un proyecto, luego los datos de su administrador, luego descarga todo el Estadio 1
y finalmente deja todo en un objeto enbebido dentro de ambos repositorios replicados.

#### fetchStateThree(key)

* param `key`: Object, String or Number
* return `promise`

Actualiza el valor de la columna `state_three` de la tupla Project en local
si no logra actualizarla, resuelve con el valor previo almacenado en local. Si


RichPicture (Resource)
------

#### fetchOne(key)

* param `key`: Object o Number
* return `promise`

Obtiene un rich-picture y luego descarga los documentos que tiene adjunto.


Session (Resource)
------

#### set_current_user(res)

* param `res`: Object
* return `promise`

Actualiza el valor de sessión local que se tiene respecto del usuario que se encuentra
haciendo uso de la aplicación. Registra además los valores de `local_iat` y `local_exp` 
para verificar cuanto tiempo de vida le queda el `token` (`JWT`)


#### refresh_token()

* return `promise`

Verifica si es necesario actualizar el `token`. Revisa cuanto tiempo falta para que este
expire, y luego verifica si es que ha pasado la mitad de ese tiempo. Si estamos dentro de la 
segunda mitad del tiempo de vida del `token`, entonces efectúa la operación de renovarlo 
en la url `/api/v1/token-refresh/`. En caso contrario, no hace nada.

#### current_user()

* return `promise`

Este método entrega el current_user y en caso de no encontrarlo
quiebra la cadena de promesas genera un error (reject) y devuelve
al usuario al login indicandole que la sesión ha expirado
#### colabs()

* return `promise`

Entrega la lista de colaboradores que tiene el usuario actualmente logeado
intenta además actualizar esta lista desde la nube, mientras tanto notifica
el valor local, y si recibe respuesta, actualiza el local y resuelve el actualizado
Si no logra conectarse, finalmente resuelve el valor local.

StateOne (Resource)
------

#### delete_tag(Object)

* param `Object`: Diccionario con el `id` del estadio 1 y `tag_id` de la etiqueta que se quiere eliminar.
* return `promise`

Elimina una etiqueta de un estadio 1.


#### delete_media(Object)

* param `Object`: Diccionario con el `id` del estadio 1 y `media_id` de la etiqueta que se quiere eliminar.
* return `promise`

Elimina una media de un estadio 1.


#### fetchOne(key)

* param `key`: Object o Number 
* return `promise`

Descarga un estadio 1, luego desgarga todas las medias y finalmente descarga todas
las etiquetas.


#### addMediaOffline(state, media)

* param `state`: Object o Number 
* param `media`: Object o Number
* return `promise`

Agrega un archivo media al objeto embebido dentro de la base de datos local.
esto es especialmente util cuando no contamos con conexión a internet y se desea
visualizar el objeto dentro de la base de datos local.


StateThree (Resource)
------

#### addCatwoe(project, catwoe)

* param `project`: Object
* param `catwoe`: Object
* return `promise`

Agrega un Catwoe a un Project. Añade el valor de `created_by` a partir del usuario
que esta usando la aplicaición (`Session.current_user()`) y el valor de `state_id` necesario
en la API.


Tag (Resource)
------


User (Resource)
------

#### changepass(Object)

* param `Object`: Diccionario con los valores `old_password`, `new_password`.
* return `promise`

Cambia la contraseña del usuario que se encuentra utilizando la aplicación.


#### colabs()

* return `promise`

Entrega una lista con todos los colaboradores de un usuario, sin importar el 
proyecto en el cual compartan labores.


#### fetchOne(key)

* param `key`: Object o Number 
* return `promise`

Descarga un usuario, luego descarga su perfil verifica además posible errores 
para el caso en que un usuario tenga mas de un perfil (*innecesario en la actualidad*).

#### allUsers

* return `promise`

Busca todos los usuarios almacenados localmente y los notifica. Luego 
intenta descargar toda la tabla de usuarios de la nube, si lo logra
resuelve los usuarios, si falla, resuelve con los usuarios almacenados
localmente
