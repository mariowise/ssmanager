angular.module('sync.resource', ['sync.remote'])

.factory('Resource', ['$q', 'Remote', function ($q, Remote) {
	var _Remote = Remote
	return function (name, remoteUri) {
		var Remote = _Remote(name, remoteUri)
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
		  		if(CONFIG.debug) console.log("Resource::find " + JSON.stringify(key).substr(0, 10))
		  		var d = $q.defer()
		  	      , self = this

		  		if(key.constructor === Array) {
		  			var notifies = [], resolves = [], ldefer = $q.defer()
                    key.forEach(function (query) {
                        self.findOne(query)
                        .then(function (resolvedItem) {
                            resolves.push(resolvedItem)
                            if(resolves.length == key.length) 
                                ldefer.resolve(resolves)
                        
                        }, function (err) {
                            resolves.push(null)
                            notifies.push(null)
                        
                        }, function (notifiedItem) {
                            notifies.push(notifiedItem)
                            if(notifies.length == key.length)
                                ldefer.notify(notifies)
                        })
                    })
                    ldefer.promise.then(defer.resolve, null, defer.notify)
                    if(key.length == 0)
                        ldefer.resolve([])                    
		  		} else
		  			self.findOne(key)
		  			.then(d.resolve, d.reject, d.notify)

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

                if(key.constructor != Array) {
                    self.fetchOne(key)
                    .then(d.resolve, d.reject, d.notify)
                } else {
                    var pms = []
                    key.forEach(function (query) {
                        pms.push(self.fetchOne(query))
                    })
                    $q.all(pms)
                    .then(d.resolve, d.reject, d.notify)
                }

                return d.promise
            }
		}
		return angular.extend({}, Remote, res)
	}
}])