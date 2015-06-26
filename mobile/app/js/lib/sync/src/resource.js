angular.module('sync.resource', ['sync.remote'])

.factory('Resource', ['$q', 'Remote', function ($q, Remote) {
	var _Remote = Remote
	return function (name, remoteUri, httpOptions) {
		var Remote = _Remote(name, remoteUri, httpOptions)
		  , res = {
		  	/*
		  	 * Busca un recurso en internet, mientras tanto notifica el Local
		  	 * si lo encuentra en internet, resuelve el nuevo, si no lo encuentra
		  	 * entonces resuleve el Local
		  	 */
		  	findOne: function (key) {
		  		if(CONFIG.debug) console.log("Resource::findOne " + JSON.stringify(key).substr(0, 10))
		  		var d = $q.defer()
		  		  , key = key[CONFIG.pk] || key.id || key

		  		Remote.get(key)
		  		.then(function (litem) {
		  			d.notify(litem)
		  			Remote._find(key)
		  			.then(d.resolve, function (err) {
		  				console.error(err)
		  				d.resolve(litem)
		  			})
		  		}, function (err) {
		  			Remote._find(key)
		  			.then(d.resolve, d.reject)
		  		})

		  		return d.promise
		  	}
		  	/*
		  	 * Ejecuta la función findOne para una lista de elementos o bien uno solo
		  	 * dependiendo si recibe un arreglo, un objeto o un id. Para aquellos objetos 
		  	 * que no se encuentran se deja un casillero 'null' en donde deben aparecer
		  	 */
		  	, find: function (key) {
		  		if(CONFIG.debug) console.log("Resource::find " + JSON.stringify(key).substr(0, 20))
		  		var d = $q.defer()
		  	      , self = this

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
		  		} else {
                    self.findOne(key)
                    .then(d.resolve, d.reject, d.notify)
                }

		  		return d.promise
		  	}
		  	/*
             * Revisa si se esta solicitando una lista de elementos o solo uno y aplica
             * el método 'fetchOne' que debe estar definido en cada Servicio.
             */
            , fetch: function (key) {
                if(CONFIG.debug) console.log("Resource::fetch (" + name + ") " + key)
                var d = $q.defer()
                  , self = this

                if(!self.fetchOne) {
                    console.error("Resource::fetch no existe el método fetchOne para la clase " + name)
                    d.reject()
                    return d.promise
                }

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
             * Realiza una búsqueda dura por local y luego realiza la búsqueda por
             * url-param en la nube. Si no obtiene respuesta entrega la búsqueda 
             * local
             */
            , where: function (filter) {
            	if(CONFIG.debug) console.log("Resource::where (" + name + ")")
            	var d = $q.defer()
            	
            	Remote.all(filter)
            	.then(function (litems) {
            		d.notify(litems)
            		Remote._where(filter)
            		.then(d.resolve, function (err) {
            			console.error(err)
            			d.resolve(litems)
            		}, d.reject)
            	}, d.reject)

            	return d.promise
            }
		}
		return angular.extend({}, Remote, res)
	}
}])