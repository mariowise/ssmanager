/*--
 *-- Remote
 *-- ------
 *--
 *-- * param `name`: String. Corresponde al nombre que tendrá la entidad para el EntityManager (Local)
 *--
 *-- Implementa las primitivas para el almacenamiento de objetos en `localForage`.
*/
angular.module('sync.local', ['LocalForageModule'])

.factory('Local', ['$q', '$localForage', function ($q, $localForage) {
	return function (name) {
        console.log("Local::constructor new instance for '" + name + "'")

		var localForage = $localForage.createInstance({
			name: name, // Necesario
			storeName: name
		})

		return {
            /*
             *-- #### get(key)
             *--
             *-- * param `key`: String o número
             *-- * return `promise`
             *--
             *-- Busca el elemento en localForage a partir de una llave (*primary key*)
             */
            get: function (key) {
                if(CONFIG.debug) console.log("Local::get " + name + "#" + key)

                var defer = $q.defer()
                  , key = key[CONFIG.pk] || key.id || key

                localForage.getItem(key)
                .then(function (item) {
                    if(CONFIG.debug) console.log(item)
                    if(item != undefined) defer.resolve(item)
                    else defer.reject(item)
                })
                .catch(function (err) {
                    console.error("ERROR: Local::get " + name + "#" + key)
                    if(CONFIG.debug) console.log(err)
                    defer.reject(err)
                })

                return defer.promise
            }
            /*
             *-- #### set(key, value)
             *--
             *-- * param `key`: String o número
             *-- * param `value`: Objeto
             *-- * return `promise`
             *--
             *-- Setea un valor a partir de una llave. En caso de que el objeto
             *-- ya esta almacenado, realiza un `angular.extend` para evitar eliminar
             *-- columnas que no se ven involucradas en la operación.
             */
            , set: function (key, value) {
                if(CONFIG.debug) console.log("Local::set " + name + "#" + key + ":" + value)

                var defer = $q.defer()

                // localForage no puede almacenar undefined
                // https://mozilla.github.io/localForage/#getitem
                if(value === undefined)
                    value = null

                if(value.toJSON)
                    value = value.toJSON()

                localForage.getItem(key)
                .then(function (item) {
                    if(item == undefined) item = {}
                    angular.extend(item, value) // De esta forma no se borran los valores previos, pisa los que concidan y no toca los otros
                    return localForage.setItem(key, item)
                })
                .then(function (item) {
                    // if(CONFIG.debug) console.log(item)
                    defer.resolve(item)
                })
                .catch(function (err) {
                    console.error("ERROR: Local::set " + name + "#" + key + ":" + value)
                    if(CONFIG.debug) console.log(err)
                    defer.reject(err)
                })

                return defer.promise
            }
            /*
             *-- #### all(filter)
             *--
             *-- * param `filter`: Objeto
             *-- * return `promise`
             *--
             *-- Retorna un arreglo con todas las filas de la tabla, en caso de entregar
             *-- un objeto, entreta solo aquellas filas que cumplen con el filtro
             */
            , all: function (filter) {
                if(CONFIG.debug) console.log("Local::all " + name)
                var defer = $q.defer()

                var items = []
                localForage.iterate(
                function (item, key) {
                    if(!filter)
                    	items.push(item)
                    else {
                    	var flag = true
                        for(var f in filter) {
                            if(item[f] != filter[f]) 
                                flag = false
                        }
                        if(flag) 
                        	items.push(item)
                    }
                })   
                .then(function (item) { // Last item
                    if(CONFIG.debug) console.log("Local::all found " + items.length + " elements")
                    defer.resolve(items)
                })  
                .catch(function (err) {
                    console.error("ERROR: Local::all " + name)
                    if(CONFIG.debug) console.log(err)
                    defer.reject(err)
                })
                
                return defer.promise
            }
            /*
             *-- #### delete(key)
             *--
             *-- * param `key`: Objeto, String o número
             *-- * return `promise`
             *--
             *-- Elimina un elemento de `localForage`.
             */
            , delete: function (key) {
                if(CONFIG.debug) console.log("Local::delete " + name + "#" + key)
                var defer = $q.defer()
                  , key = key[CONFIG.pk] || key.id || key

                localForage.removeItem(key)
                .then(function () {
                    defer.resolve()
                })
                .catch(function (err) {
                    console.error("ERROR: Local::delete " + name + "#" + key)
                    if(CONFIG.debug) console.log(err)
                    defer.reject(err)
                })

                return defer.promise
            }
            /*
             *-- #### drop()
             *--
             *-- * return `promise`
             *--
             *-- Borra todo el contenido de la tabla en `localForage`
             */
            , drop: function () {
                if(CONFIG.debug) console.log("Local::drop " + name)

                var defer = $q.defer()

                localForage.clear()
                .then(function () {
                    defer.resolve()
                }, function (err) {
                    console.error("ERROR: Local::drop " + name)
                    if(CONFIG.debug) console.log(err)
                    defer.reject(err)
                })

                return defer.promise
            }
            /*
             *-- #### length()
             *--
             *-- * return `promise`
             *--
             *-- Obtiene el largo de la tabla en `localForage`
             */
            , length: function () {
                if(CONFIG.debug) console.log("Local::length " + name)

                var defer = $q.defer()

                localForage.length()
                .then(function (length) {
                    if(CONFIG.debug) console.log(length)
                    defer.resolve(length)
                })
                .catch(function (err) {
                    console.error("ERROR: Local::length " + name)
                    if(CONFIG.debug) console.log(err)
                    defer.reject(err)
                })

                return defer.promise
            }
            /*
             *-- #### show([key]) - DEBUG
             *--
             *-- * param `key`: Objeto, String o número
             *-- * return `promise`
             *--
             *-- Muestra por consola un objeto o bien la tabla completa. 
             *-- Además, deja el resultado en `window.neo` para poder examinarlo
             */
            , show: function(key) {
                if(key) {
                    this.get(key)
                    .then(function (item) {
                        console.log("Local::show " + name)
                        console.log(item)
                        window.neo = item
                    })
                } else {
                    this.all()
                    .then(function (items) {
                        console.log("Local::show " + name)
                        console.log(items)
                        window.neo = items
                    })
                }
            }
		}
	}
}])