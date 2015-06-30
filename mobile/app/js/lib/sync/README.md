Resource
--------
Hereda los métodos de Remote (y por lo tanto también de Local). Su misión
es contener todos aquellos métodos encargados de lograr la sincronizción
y el funcionamiento `OffLine` de la aplicación.

### findOne(key)

    * param `key`: Objeto o bien un número (indicando el *primary key*)
    * return `promise`

Busca un recurso en internet, mientras tanto notifica el Local
si lo encuentra en internet, resuelve el nuevo, si no lo encuentra
entonces resuleve el Local. Si el objeto no se encuentra ni en Remote
ni en Local, entonces rechaza el error de buscarlo en Remote

### find(key)

    * param ´key´: Objeto, lista de objetos o número 
    * return ´promise´

Ejecuta la función findOne para una lista de elementos o bien uno solo
dependiendo si recibe un arreglo, un objeto o un id. Para aquellos objetos 
que no se encuentran se deja un casillero 'null' en donde deben aparecer

### fetch(key)

    * param ´key´: Objeto, lista de objetos o número
    * return ´promise´

Revisa si se esta solicitando una lista de elementos o solo uno y aplica
el método 'fetchOne' que debe estar definido en cada Servicio.

### where(filter)

    * param ´filter´: Objeto (Hash)
    * return ´promise´

Realiza una búsqueda dura por local y luego realiza la búsqueda por
url-param en la nube. Si no obtiene respuesta entrega la búsqueda 
local

### create(fields)

    * param ´fields´: Objeto (Hash)
    * return ´promise´

Intenta crear un objeto en la nube y si falla lo crea de forma
local, marcando su estado (atributo __syncPending) = true

### syncOne(litem)

    * param ´litem´: Objeto (Hash)
    * return ´promise´

Si la tupla posee la bandera __syncPending ejecuta _update
si el _update arroja 404 (no existe) ejecuta _create
