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
                    defer.resolve(item)
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

                localForage.setItem(key, value)
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
             * Intenta buscar la tupla e internet y actualizar local
             * Si falla al encontrarla en internet, intenta entregar el valor 
             * que tenga localForage (el cual podría ser undefined)
             */
            , find: function(key) {
                if(CONFIG.debug) console.log("ResourceFactory::find " + name + "#" + key)

                var defer = $q.defer()
                  , self = this

                // this.remote().get({ id: key }, function (item) {
                this._find(key)
                .then(defer.resolve, function (err) {
                    console.error("ResourceFactory::find could not find " + name + " #" + key)
                    self.get(key)
                    .then(defer.resolve, defer.reject)
                })  

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

                this.remote().get({ id: key }, function (item) {
                    if(CONFIG.debug) console.log("ResourceFactory::_find found object " + JSON.stringify(item))
                    self.set(key, item)
                    .then(defer.resolve, defer.reject)
                }, defer.reject)

                return defer.promise
            }

            /* [ DEPRECATED ]
             * Intenta actualizar el valor en la nube y si no puede lo guarda como pending
             * en localForage. Si logra actualizarlo en la nube, igualmente lo guarda
             * en localForage, pero sin la marca de 'pending'
             */
            // , save: function (value) {
            //     if(CONFIG.debug) console.log("ResourceFactory::save " + name)

            //     var defer = $q.defer()
            //       , self = this
            //       , key = value[CONFIG.pk] || value.id

            //     if(!value[CONFIG.pk] && !value.id) {
            //         value[CONFIG.pk] = guid()
            //         key = value[CONFIG.pk]
            //     }
                
            //     this.remote().save(value, function () {
            //         if(CONFIG.debug) console.log("ResourceFactory::save saved object " + JSON.stringify(value))
            //         self.set(key, value)
            //         .then(defer.resolve, defer.reject)
            //     }, function (err) {
            //         console.error("ResourceFactory::save could not save object " + JSON.stringify(value))
            //         value.status = 'pending'
            //         self.set(key, value)
            //         .then(defer.resolve, defer.reject)
            //     })

            //     return defer.promise
            // }

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