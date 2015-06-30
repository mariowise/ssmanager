angular.module('sync.remote', ['sync.local', 'ngResource'])

.factory('Remote', ['$q', '$resource', 'Local', function ($q, $resource, Local) {
    var _Local = Local
    return function (name, remoteUri, httpMethods) {
        angular.extend(httpMethods || {}, { save: { method: "POST", url: CONFIG.api(remoteUri.toLowerCase()) + "/" } })
        var Local = _Local(name)
		  , res = {
		  	/*
             * Retorna el recurso angular.resource que conecta con
             * el recurso publicado en la API
             */
            remote: function() {
                return $resource(
                    CONFIG.api(remoteUri.toLowerCase() + '/:id/'), 
                    { id: '@id' }, 
                    angular.extend(CONFIG.apiMethods, httpMethods || {})
                )
            }
            /*
             * Realiza un get de ng-resource
             * esta para trabajar con promesas $q las peticiones get
             */
            , _find: function(key) {
                if(CONFIG.debug) console.log("Remote::_find " + name + "#" + key)
                var defer = $q.defer()
                  , key = key[CONFIG.pk] || key.id || key                  

                this.remote().get({ id: key }, function (item) {
                    if(CONFIG.debug) console.log("Remote::_find found object " + JSON.stringify(item))
                    Local.set(key, item)
                    .then(defer.resolve, defer.reject)
                }, defer.reject)

                return defer.promise
            }
            /*
             * Intenta crear un objeto en la nube y si no puede rechaza la promesa, si logra crearlo
             * entonces además lo guarda localmente
             */
            , _create: function (value) {
            	if(CONFIG.debug) console.log("Remote::_create " + JSON.stringify(value).substr(0, 10))
                var defer = $q.defer()

                this.remote().save(value, function (newItem) {
                    if(CONFIG.debug) console.log("Remote::_create just created " + JSON.stringify(newItem))
                    Local.set(newItem.id, newItem)
                    .then(defer.resolve, defer.reject)
                }, defer.reject)

                return defer.promise
            }
            /*
             * Intenta actualizar un objeto en la nube y si no puede rechaza la promesa
             */
            , _update: function (value) {
            	if(CONFIG.debug) console.log("Remote::_update " + JSON.stringify(value).substr(0, 10))
                var defer = $q.defer()
                  , key = value[CONFIG.pk] || value.id

                this.remote().update(value, function () {
                    if(CONFIG.debug) console.log("Remote::_update just updated " + JSON.stringify(value))
                    Local.set(key, value)
                    .then(defer.resolve, defer.reject)
                }, defer.reject)

                return defer.promise
            }
            /*
             * Intenta eliminar desde la nube para luego eliminar desde local
             * si no logra eliminar en la nube, entonces rechaza
             */
            , _destroy: function (value) {
            	if(CONFIG.debug) console.log("Remote::_destroy " + JSON.stringify(value).substr(0, 10))
                var defer = $q.defer()
                  , key = value[CONFIG.pk] || value.id || value

                this.remote().delete({ id: key }, function (res) {
                    if(CONFIG.debug) console.log("Remote::_destroy deleted the element #" + key)
                    Local.delete(key)
                    .then(defer.resolve, defer.reject)
                }, defer.reject)

                return defer.promise
            }
            /*
             * Este método es un wrapper de query para trabajar con promesas $q
             * Al encontrar los elementos aprovecha de actualizarlos en Local
             */
            , _where: function (filter) {
            	if(CONFIG.debug) console.log("Remote::_where " + JSON.stringify(filter).substr(0, 10))
                var d = $q.defer()

                this.remote().query(filter).$promise
                .then(function (res) {
                    var fns = []
                    res.forEach(function (item) {
                    	fns.push(Local.set(item.id, item))
                    })
                    return $q.all(fns)
                })
                .then(function (res) {
                	if(CONFIG.debug) console.log("Remote::_where found " + res.length + " objects")
                	d.resolve(res)
                })
                .catch(d.reject)

                return d.promise
            }
		}

        for(method in httpMethods) {
            res[method] = (function (method) {
                return function (params) {
                    // console.log(name + "::" + method + "()")
                    var d = $q.defer()

                    res.remote()[method](params).$promise
                    .then(d.resolve, d.reject)

                    return d.promise
                }
            })(method)

            
        }

		return angular.extend({}, Local, res)
	}
}])
