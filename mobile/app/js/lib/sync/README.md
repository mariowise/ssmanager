[< Volver](https://github.com/mariowise/ssmanager/tree/master/mobile)

Sync
====

El módulo de sincronización basa su estructura en 3 clases abstractas que heredan sus métodos. `Local`, `Remote` y `Resource`:

* **Local**: Se trata de una clase `wrapper` que contiene todos los métodos que llevan a cabo el almacenamiento de datos de forma local al dispositivo. Para esto, hace uso de `localForage` como librería para lograr almacenar información en repositorios como `localStorage`, `IndexedDB` o `WebSQL`.
* **Remote**: Se trata de una clase `wrapper` que contiene los métodos que llevan a cabo las labores de almacenamiento remoto de los datos. Hace uso del servicio `$resource` provisto por `Angualar` para comunicarse con la `API REST` del sistema.
* **Resource**: Se trata de una clase que coordina la utilización de los métodos de la clase `Local` y `Remote` para entregar servicios de almacenamiento. Gestiona los eventos provenientes de ambos mundos. Pretende entregar servicios que permitan presindir de la conexión a internet, se encarga de gestionar las excepciones de las peticiones y hacer uso de la base de datos local como si se tratase de una `cache`.

Remote
------
* param `name`: String. Corresponde al nombre que tendrá la entidad para el EntityManager (Local)

Implementa las primitivas para el almacenamiento de objetos en `localForage`.

#### get(key)

* param `key`: String o número
* return `promise`

Busca el elemento en localForage a partir de una llave (*primary key*)

#### set(key, value)

* param `key`: String o número
* param `value`: Objeto
* return `promise`

Setea un valor a partir de una llave. En caso de que el objeto
ya esta almacenado, realiza un `angular.extend` para evitar eliminar
columnas que no se ven involucradas en la operación.

#### all(filter)

* param `filter`: Objeto
* return `promise`

Retorna un arreglo con todas las filas de la tabla, en caso de entregar
un objeto, entreta solo aquellas filas que cumplen con el filtro

#### delete(key)

* param `key`: Objeto, String o número
* return `promise`

Elimina un elemento de `localForage`.

#### drop()

* return `promise`

Borra todo el contenido de la tabla en `localForage`

#### length()

* return `promise`

Obtiene el largo de la tabla en `localForage`

#### show([key]) - DEBUG

* param `key`: Objeto, String o número
* return `promise`

Muestra por consola un objeto o bien la tabla completa. 
Además, deja el resultado en `window.neo` para poder examinarlo

Remote
------
* param `name`: String. Corresponde al nombre que tendrá la entidad para el EntityManager (Local)
* param `remoteUri`: String. Se trata del nombre que recibe el recurso en la API, ej: http://www.softsystemanager.com/api/v1/**remoteUri**
* param `httpOptions`: Object. Se trata de un objeto que extiende a la configuración por defecto de `$resource`, que fue fijada en config.js 

Implementa las primitivas que permiten consumir los recursos de la API REST.
Toda método de Remote, solo tiene exito si es que logra comunicarse con la API,
en caso contrario siempre rechaza.

#### remote()

* return `$resource`

Retorna el recurso angular.resource que conecta con
el recurso publicado en la API.

#### _find(key)


* param `key`: Objeto o número

Realiza un get de ng-resource
esta para trabajar con promesas $q las peticiones get

#### _create(value)


* param `value`: Objeto o número

Intenta crear un objeto en la nube y si no puede rechaza la promesa, si logra crearlo
entonces además lo guarda localmente

#### _update(value)


* param `value`: Objeto o número

Intenta actualizar un objeto en la nube y si no puede rechaza la promesa

#### _destroy(value)


* param `value`: Objeto o número

Intenta eliminar desde la nube para luego eliminar desde local
si no logra eliminar en la nube, entonces rechaza

#### _where(filter)


* param `filter`: Objeto o número

Este método es un wrapper de query para trabajar con promesas $q
Al encontrar los elementos aprovecha de actualizarlos en Local
Resource
--------

* param `name`: String. Corresponde al nombre que tendrá la entidad para el EntityManager (Local)
* param `remoteUri`: String. Se trata del nombre que recibe el recurso en la API, ej: http://www.softsystemanager.com/api/v1/**remoteUri**
* param `httpOptions`: Object. Se trata de un objeto que extiende a la configuración por defecto de `$resource`, que fue fijada en config.js

Hereda los métodos de Remote (y por lo tanto también de Local). Su misión
es contener todos aquellos métodos encargados de lograr la sincronizción
y el funcionamiento `OffLine` de la aplicación.

#### findOne(key)

* param `key`: Objeto o bien un número (indicando el *primary key*)
* return `promise`

Busca un recurso en internet, mientras tanto notifica el Local
si lo encuentra en internet, resuelve el nuevo, si no lo encuentra
entonces resuleve el Local. Si el objeto no se encuentra ni en Remote
ni en Local, entonces rechaza el error de buscarlo en Remote

#### find(key)

* param `key`: Objeto, lista de objetos o número 
* return `promise`

Ejecuta la función findOne para una lista de elementos o bien uno solo
dependiendo si recibe un arreglo, un objeto o un id. Para aquellos objetos 
que no se encuentran se deja un casillero 'null' en donde deben aparecer

#### fetch(key)

* param `key`: Objeto, lista de objetos o número
* return `promise`

Revisa si se esta solicitando una lista de elementos o solo uno y aplica
el método 'fetchOne' que debe estar definido en cada Servicio.

#### where(filter)

* param `filter`: Objeto (Hash)
* return `promise`

Realiza una búsqueda dura por local y luego realiza la búsqueda por
url-param en la nube. Si no obtiene respuesta entrega la búsqueda 
local

#### create(fields)

* param `fields`: Objeto (Hash)
* return `promise`

Intenta crear un objeto en la nube y si falla lo crea de forma
local, marcando su estado (atributo __syncPending) = true

#### syncOne(litem)

* param `litem`: Objeto (Hash)
* return `promise`

Si la tupla posee la bandera __syncPending ejecuta _update
si el _update arroja 404 (no existe) ejecuta _create
