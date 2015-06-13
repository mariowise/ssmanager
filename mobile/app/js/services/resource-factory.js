angular.module('app.services.resource-factory', ['LocalForageModule'])

.factory('ResourceFactory', ['$q', '$localForage', '$resource', function ($q, $localForage, $resource) {

    function ResourceFactory (name, pluralName) {
        if(CONFIG.debug) console.log("ResourceFactory::constructor new instance for '" + name + "'")
        
        // Se crea la nueva instancia de localForage
        var localForage = $localForage.createInstance({
            name: name, // Necesario
            storeName: name
        })

        return {

            /*** LOCAL ***************************************************************/

            /*
             * Retorna un valor según llave
             */
            get: function (key) {
                if(CONFIG.debug) console.log("ResourceFactory::get " + name + "#" + key)

                var defer = $q.defer()

                localForage.getItem(key)
                .then(function (item) {
                    if(CONFIG.debug) console.log(item)
                    if(item != undefined) defer.resolve(item)
                    else defer.reject(item)
                })
                .catch(function (err) {
                    console.error("ERROR: ResourceFactory::get " + name + "#" + key)
                    if(CONFIG.debug) console.log(err)
                    defer.reject(err)
                })

                return defer.promise
            }

            /*
             * Setea un llave-valor en la tabla
             */
            , set: function (key, value) {
                if(CONFIG.debug) console.log("ResourceFactory::set " + name + "#" + key + ":" + value)

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
                    angular.extend(item, value) // De esta forma no se borran los campos locales
                    return localForage.setItem(key, item)
                })
                .then(function (item) {
                    // if(CONFIG.debug) console.log(item)
                    defer.resolve(item)
                })
                .catch(function (err) {
                    console.error("ERROR: ResourceFactory::set " + name + "#" + key + ":" + value)
                    if(CONFIG.debug) console.log(err)
                    defer.reject(err)
                })

                return defer.promise
            }

            /*
             * Retorna un arreglo con todas las filas de la tabla
             */
            , all: function () {
                if(CONFIG.debug) console.log("ResourceFactory::all " + name)

                var defer = $q.defer()

                var items = []
                localForage.iterate(
                function (item, key) {
                    items.push(item)
                })   
                .then(function (item) { // Last item
                    // if(CONFIG.debug) console.log(items)
                    defer.resolve(items)
                })  
                .catch(function (err) {
                    console.error("ERROR: ResourceFactory::all " + name)
                    if(CONFIG.debug) console.log(err)
                    defer.reject(err)
                })
                
                return defer.promise
            }

            /*
             * Elimina un elemento de la tabla
             */
            , delete: function (key) {
                if(CONFIG.debug) console.log("ResourceFactory::delete " + name + "#" + key)

                var defer = $q.defer()

                localForage.removeItem(key)
                .then(function () {
                    defer.resolve()
                })
                .catch(function (err) {
                    console.error("ERROR: ResourceFactory::delete " + name + "#" + key)
                    if(CONFIG.debug) console.log(err)
                    defer.reject(err)
                })

                return defer.promise
            }

            /*
             * Borra toda la tabla
             */
            , drop: function () {
                if(CONFIG.debug) console.log("ResourceFactory::drop " + name)

                var defer = $q.defer()

                localForage.clear()
                .then(function () {
                    defer.resolve()
                }, function (err) {
                    console.error("ERROR: ResourceFactory::drop " + name)
                    if(CONFIG.debug) console.log(err)
                    defer.reject(err)
                })

                return defer.promise
            }

            /*
             * Obtiene el largo de la tabla
             */
            , length: function () {
                if(CONFIG.debug) console.log("ResourceFactory::length " + name)

                var defer = $q.defer()

                localForage.length()
                .then(function (length) {
                    if(CONFIG.debug) console.log(length)
                    defer.resolve(length)
                })
                .catch(function (err) {
                    console.error("ERROR: ResourceFactory::length " + name)
                    if(CONFIG.debug) console.log(err)
                    defer.reject(err)
                })

                return defer.promise
            }

            /*** REMOTE ***************************************************************/

            /*
             * Busca la tupla en localForage y la notifica, luego intenta buscarla en internet
             * y si la encuentra la actualizará y la resolvera. Si no la encuentra, se resuelve
             * el resultado que se encontró en localForage originalmente. La función esta preparada
             * para recibir tanto ID's, como objetos y tambien arreglos de ID's
             */
            , find: function(key) {
                if(CONFIG.debug) console.log("ResourceFactory::find " + name + "#" + key)

                var defer = $q.defer()
                  , self = this

                if(key.constructor == Array) {

                    var notifies = [], resolves = [], ldefer = $q.defer()
                    key.forEach(function (query) {
                        self.find(query)
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
                    if(key.length == 0) {
                        ldefer.notify([])
                        ldefer.resolve([])                    
                    }

                } else  {

                    var key = (key[CONFIG.pk]) ? key[CONFIG.pk] : key
                    
                    self.get(key)
                    .then(function (local) {
                        defer.notify(local)                    
                        self._find(key)
                        .then(defer.resolve, function (err) {
                            defer.resolve(local)
                        })
                    }, defer.reject) 

                }
                
                return defer.promise
            }

            /*
             * Realiza un get de ng-resource
             * esta para trabajar con promesas $q las peticiones get
             */
            , _find: function(key) {
                if(CONFIG.debug) console.log("ResourceFactory::_find " + name + "#" + key)

                var defer = $q.defer()
                  , self = this                  

                self.remote().get({ id: key }, function (item) {
                    if(CONFIG.debug) console.log("ResourceFactory::_find found object " + JSON.stringify(item))
                    self.set(key, item)
                    .then(defer.resolve, defer.reject)
                }, defer.reject)

                return defer.promise
            }

            /*
             * Efectua un .update sobre ng-resource
             * con el dato recibido luego de actualizar en la nube, lo guarda en local y retorna
             * si no puede actualizar en la nuve marca .status="pending" para sincronizar luego
             * y retorna un set local
             */
            , update: function (value) {
                if(CONFIG.debug) console.log("ResourceFactory::update " + name)

                var defer = $q.defer()
                  , self = this
                  , key = value[CONFIG.pk] || value.id

                if(!value[CONFIG.pk] && !value.id) {
                    value[CONFIG.pk] = guid()
                    key = value[CONFIG.pk]
                }
                
                this.remote().update(value, function () {
                    if(CONFIG.debug) console.log("ResourceFactory::update updated object " + JSON.stringify(value))
                    self.set(key, value)
                    .then(defer.resolve, defer.reject)
                }, function (err) {
                    console.error("ResourceFactory::update could not update object " + JSON.stringify(value))
                    value.status = 'pending'
                    self.set(key, value)
                    .then(defer.resolve, defer.reject)
                })

                return defer.promise
            }

            /*
             * Intenta crear un objeto en la nube y si no puede lo crea localmente y lo deja con 
             * status="pending create" para ser creado con posterioridad
             */
            , create: function (value) {
                var defer = $q.defer()
                  , self = this

                this._create(value)
                .then(function (newItem) {
                    if(CONFIG.debug) console.log("ResourceFactory::create updated object " + JSON.stringify(value))
                    self.set(newItem.id, newItem)
                    .then(defer.resolve, defer.reject)
                }, function (err) {
                    if(value.id) {
                        value.status = "pending create"
                        self.set(value.id, value)
                    } else defer.reject(err)
                })

                return defer.promise
            }

            /*
             * Intenta crear un objeto en la nube y si no puede rechaza la promesa, si logra crearlo
             * entonces además lo guarda localmente
             */
            , _create: function (value) {
                var defer = $q.defer()
                  , self = this

                this.remote().save(value, function (newItem) {
                    if(CONFIG.debug) console.log("ResourceFactory::create creates " + JSON.stringify(newItem))
                    self.set(newItem.id, newItem)
                    .then(defer.resolve, defer.reject)
                }, defer.reject)

                return defer.promise
            }

            /*
             * Revisa si se esta solicitando una lista de elementos o solo uno y aplica
             * el método 'fetchOne' que debe estar definido en cada Servicio.
             */
            , fetch: function (key) {
                var d = $q.defer()
                  , self = this

                if(!self.fetchOne) {
                    console.error("ResourceFactory::fetch no existe el método fetchOne para la clase " + name)
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

            /*
             * Intenta eliminar desde la nube para luego eliminar desde local
             * si no logra eliminar en la nube, entonces rechaza
             */
            , _destroy: function (obj) {
                var defer = $q.defer()
                  , self = this
                  , key = obj.id || obj

                this.remote().delete({ id: key }, function (res) {
                    if(CONFIG.debug) console.log("ResourceFactory::_destroy deleted the element #" + key)
                    self.delete(key)
                    .then(defer.resolve, defer.reject)
                }, defer.reject)

                return defer.promise
            }            

            /*
             * Syncronizar los pendientes
             * - Considera todas las filas con .state == 'pending' y aplica update
             * - Luego elimina el .state y guarda en localForage
             */
            , sync: function () {
                if(CONFIG.debug) console.log("ResourceFactory::sync " + name)

                var defer = $q.defer()
                  , remote = this.remote()
                  , self = this
                  , fns = []

                // Push resources
                self.all()
                .then(function (items) {
                    var d = $q.defer()

                    items.forEach(function (item) {
                        if(item.status == 'pending' || item.status == 'pending create') // Si la fila esta en 'pending'
                            fns.push(function (callback) {
                                remote[(item.status == 'pending') ? "update" : "save"](item, function () {
                                    delete item.status // Elimina el .state
                                    self.set(item[CONFIG.pk], item) // Guarda en localForage
                                    .then(function () {
                                        callback(null, item)
                                    })
                                })
                            })                        
                    })
                    async.series(fns, function (err, results) {
                        if(CONFIG.debug) console.log("ResourceFactory::sync " + name + ", " + results.length + " jobs finished")
                        if(CONFIG.debug) console.log(err)
                        
                        if(!err)
                            d.resolve()
                        else 
                            d.reject()
                    })

                    return d.promise
                })

                // Pull resources if exists
                .then(function () {
                    if(self.pull) {
                        if(CONFIG.debug) console.log("ResourceFactory::sync calling pull method on resource " + name)
                        return self.pull()
                    }
                })

                // Finalmente se retorna la lista actual en BD de resources
                .then(function () {
                    if(CONFIG.debug) console.log("ResourceFactory::sync sending all() response on " + name)
                    self.all()
                    .then(defer.resolve, defer.reject)
                }, function () { // Siempre retorna la lista que hay en BD
                    console.error("ResourceFactory::sync ha fallado para el recurso " + name)
                    self.all()
                    .then(defer.resolve, defer.reject)
                })

                return defer.promise
            }

            /*
             * [ DEV ONLY ] 
             */
            , show: function() {
                this.all()
                .then(function (items) {
                    console.log("ResourceFactory::show " + name)
                    console.log(items)
                })
            }

            /*
             * Realiza una búsqueda local por toda tabla
             * retornando el conjunto de elementos que cumplen igualdad
             */
            , where: function(filter) {
                var d = $q.defer()

                this.all()
                .then(function (items) {
                    var response = []
                    items.forEach(function (item) {
                        var flag = true
                        for(var f in filter) {
                            if(item[f] != filter[f]) 
                                flag = false
                        }
                        if(flag) response.push(item)
                    })
                    d.resolve(response)
                }, d.reject)

                return d.promise
            }

            /*
             * Este método es un wrapper de query para trabajar con promesas $q
             */
            , _where: function (filter) {
                var d = $q.defer()
                  , self = this

                self.remote().query(filter, d.resolve, d.reject)

                return d.promise
            }

            /*
             * Retorna el recurso angular.resource que conecta con
             * el recurso publicado en la API
             */
            , remote: function() {
                this._remote = $resource(
                    CONFIG.api(pluralName.toLowerCase() + '/:id/'), 
                    { id: '@id' }, 
                    CONFIG.apiMethods
                )
                return this._remote
            }
        }
    }

    return ResourceFactory
}])

// Random id =P
// http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(10)
      .substring(1);
  }
  return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
}