/*--
 *-- Resource
 *-- --------
 *-- 
 *-- * param `name`: String. Corresponde al nombre que tendrá la entidad para el EntityManager (Local)
 *-- * param `remoteUri`: String. Se trata del nombre que recibe el recurso en la API, ej: http://www.softsystemanager.com/api/v1/**remoteUri**
 *-- * param `httpOptions`: Object. Se trata de un objeto que extiende a la configuración por defecto de `$resource`, que fue fijada en config.js
 *-- 
 *-- Hereda los métodos de Remote (y por lo tanto también de Local). Su misión
 *-- es contener todos aquellos métodos encargados de lograr la sincronizción
 *-- y el funcionamiento `OffLine` de la aplicación.
*/
angular.module('sync.resource', ['sync.remote'])

.factory('Resource', ['$q', 'Remote', function ($q, Remote) {
	var _Remote = Remote
	return function (name, remoteUri, httpOptions) {
		var Remote = _Remote(name, remoteUri, httpOptions)
		  , res = {}
	  	/* 
         *-- #### findOne(key)
         *--
         *-- * param `key`: Objeto o bien un número (indicando el *primary key*)
         *-- * return `promise`
         *--
	  	 *-- Busca un recurso en internet, mientras tanto notifica el Local
	  	 *-- si lo encuentra en internet, resuelve el nuevo, si no lo encuentra
	  	 *-- entonces resuleve el Local. Si el objeto no se encuentra ni en Remote
         *-- ni en Local, entonces rechaza el error de buscarlo en Remote
	  	 */
	  	res.findOne = function (key) {
	  		if(CONFIG.debug) console.log("Resource::findOne " + JSON.stringify(key).substr(0, 10))
	  		var d = $q.defer()
	  		  , key = key[CONFIG.pk] || key.id || key

	  		Remote.get(key)
	  		.then(function (litem) {
	  			d.notify(litem)
	  			Remote._find(key)
	  			.then(d.resolve, function (err) {
	  				d.resolve(litem)
	  			})
	  		}, function (err) {
	  			Remote._find(key)
	  			.then(d.resolve, d.reject)
	  		})

	  		return d.promise
	  	}
	  	/*
         *-- #### find(key)
         *--
         *-- * param `key`: Objeto, lista de objetos o número 
         *-- * return `promise`
         *--
	  	 *-- Ejecuta la función findOne para una lista de elementos o bien uno solo
	  	 *-- dependiendo si recibe un arreglo, un objeto o un id. Para aquellos objetos 
	  	 *-- que no se encuentran se deja un casillero 'null' en donde deben aparecer
	  	 */
        res.find = function (key) {
	  		if(CONFIG.debug) console.log("Resource::find " + JSON.stringify(key).substr(0, 20))
	  		var d = $q.defer()
	  	      , self = this

            // if(!key) {
            //     d.reject(key)
            //     return d.promise
            // }

	  		if(key.constructor === Array) {
                var count = 0, lc = 0, results = [], notifieds = []
                key.forEach(function (query, i) {
                    self.findOne(query)
                    .then(function (item) {
                        results[i] = item
                        count++
                        if(count == key.length)
                            d.resolve(results)
                    }, function (err) {
                        results[i] = null
                        count++
                        if(count == key.length)
                            d.resolve(results)
                    }, function (litem) {
                        notifieds[i] = litem
                        lc++
                        if(lc == key.length)
                            d.notify(notifieds)
                    })
                })
                if(key.length == 0) d.resolve([])
	  		} else {
                self.findOne(key)
                .then(d.resolve, d.reject, d.notify)
            }

	  		return d.promise
	  	}
	  	/*
         *-- #### fetch(key)
         *--
         *-- * param `key`: Objeto, lista de objetos o número
         *-- * return `promise`
         *--
         *-- Revisa si se esta solicitando una lista de elementos o solo uno y aplica
         *-- el método 'fetchOne' que debe estar definido en cada Servicio.
         */
        res.fetch = function (key) {
            if(CONFIG.debug) console.log("Resource::fetch (" + name + ") " + key)
            var d = $q.defer()
              , self = this

            if(!self.fetchOne) {
                console.error("Resource::fetch no existe el método fetchOne para la clase " + name)
                d.reject()
                return d.promise
            }

            // if(!key) {
            //     d.reject(key)
            //     return d.promise
            // }

            if(key.constructor == Array) {
                var count = 0, lc = 0, results = [], notifieds = []
                key.forEach(function (query, i) {
                    self.fetchOne(query)
                    .then(function (item) {
                        results[i] = item
                        count++
                        if(count == key.length)
                            d.resolve(results)
                    }, function (err) {
                        results[i] = null
                        count++
                        if(count == key.length)
                            d.resolve(results)
                    }, function (litem) {
                        notifieds[i] = litem
                        lc++
                        if(lc == key.length)
                            d.notify(notifieds)
                    })  
                })
                if(key.length == 0) d.resolve([])
            } else {
                self.fetchOne(key)
                .then(d.resolve, d.reject, d.notify)
            }

            return d.promise
        }

        /*
         *-- #### where(filter)
         *--
         *-- * param `filter`: Objeto (Hash)
         *-- * return `promise`
         *--
         *-- Realiza una búsqueda dura por local y luego realiza la búsqueda por
         *-- url-param en la nube. Si no obtiene respuesta entrega la búsqueda 
         *-- local
         */
        res.where = function (filter) {
        	if(CONFIG.debug) console.log("Resource::where (" + name + ")")
        	var d = $q.defer()
        	
        	Remote.all(filter)
        	.then(function (litems) {
        		d.notify(litems)
        		Remote._where(filter)
        		.then(d.resolve, function (err) {
        			console.warn(err)
        			d.resolve(litems)
        		}, d.reject)
        	}, d.reject)

        	return d.promise
        }

        /*
         *-- #### create(fields)
         *--
         *-- * param `fields`: Objeto (Hash)
         *-- * return `promise`
         *--
         *-- Intenta crear un objeto en la nube y si falla lo crea de forma
         *-- local, marcando su estado (atributo __syncPending) = true
         */
        res.create = function (fields) {
            var d = $q.defer()

            Remote._create(fields)
            .then(d.resolve, function (err) {
                fields.id = guid()              // Se le crea un ID de 16 dígitos
                fields.__syncPending = true     // Se marca com no sincronizado
                Remote.set(fields.id, fields)
                .then(d.resolve, d.reject)
            })

            return d.promise
        }

        /*
         *-- #### syncOne(litem)
         *--
         *-- * param `litem`: Objeto (Hash)
         *-- * return `promise`
         *--
         *-- Si la tupla posee la bandera __syncPending ejecuta _update
         *-- si el _update arroja 404 (no existe) ejecuta _create
         */
        res.syncOne = function (litem) {
            var d = $q.defer()
              , key = litem[CONFIG.pk] || litem.id || litem

            Remote.get(key)
            .then(function (litem) {
                if(litem.__syncPending)
                    return Remote._update(litem)
                else d.resolve(litem)
            })
            .then(d.resolve, function (err) {
                if(err.status == 404) {
                    return Remote._create(err.config.data)
                } else d.reject(err)
            })
            .then(function (ritem) {
                delete ritem.__syncPending
                Remote.set(ritem.id, ritem)
                .then(d.resolve, d.reject)
            }, d.reject)

            return d.promise
        }
		return angular.extend({}, Remote, res)
	}
}])