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

            /*
             * Retorna un valor según llave
             */
            get: function (key, cb) {
                if(CONFIG.debug) console.log("ResourceFactory::get " + name + "#" + key)

                var defer = $q.defer()

                localForage.getItem(key)
                .then(function (item) {
                    if(CONFIG.debug) console.log(item)
                    defer.resolve(item)
                    if(cb) cb(item)
                })
                .catch(function (err) {
                    console.error("ERROR: ResourceFactory::get " + name + "#" + key)
                    if(CONFIG.debug) console.log(err)
                })

                return defer.promise
            },

            /*
             * Intenta buscar la tupla e internet y actualizar localForage
             * Si falla al encontrarla en internet, intenta entregar el valor 
             * que tenga localForage (el cual podría ser undefined)
             */
            find: function(key, cb) {
                if(CONFIG.debug) console.log("ResourceFactory::find " + name + "#" + key)

                var defer = $q.defer()
                  , self = this
                  , remote = this.remote()

                remote.get({ id: key }, function (item) {
                    
                    if(CONFIG.debug) console.log(item[0][CONFIG.pk])

                    self.set(key, item)
                    .then(function (item) {
                        // Se tiene el item actualizado en localForage
                        defer.resolve(item)
                        if(cb) cb(item)
                    })
                    .catch(function (err) {
                        console.error("ERROR: ResourceFactory::find " + name + "#" + key + " no ha sido posible guardar en localForage")
                        if(CONFIG.debug) console.log(err)
                    })

                }, function (err) {
                    if(CONFIG.debug) console.log("ResourceFactory::find " + name + " miss " + key)
                    self.get(key).then(function (item) { defer.resolve(item) })
                    if (cb) self.get(key, cb)
                })  

                return defer.promise
            },

            /*
             * Setea un llave-valor en la tabla
             */
            set: function (key, value, cb) {
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
                    if (cb) cb(item)
                })
                .catch(function (err) {
                    console.error("ERROR: ResourceFactory::set " + name + "#" + key + ":" + value)
                    if(CONFIG.debug) console.log(err)
                })

                return defer.promise
            },

            /*
             * Intenta actualizar el valor en la nube y si no puede lo guarda como pending
             * en localForage. Si logra actualizarlo en la nube, igualmente lo guarda
             * en localForage, pero sin la marca de 'pending'
             */
            save: function (value, cb) {
                if(CONFIG.debug) console.log("ResourceFactory::save " + name)

                var defer = $q.defer()
                  , self = this
                  , remote = this.remote()
                  , key = value[CONFIG.pk] || value.id

                if(!value[CONFIG.pk] && !value.id) {
                    value[CONFIG.pk] = guid()
                    key = value[CONFIG.pk]
                }
                
                remote.save(value, function () {

                    self.set(key, value).then(function (item) { defer.resolve(item) })
                    if (cb) self.set(key, value, cb)

                }, function (err) {
                    
                    value.status = 'pending'
                    self.set(key, value).then(function (item) { defer.resolve(item) })
                    if (cb) self.set(key, value, cb)                    

                })

                return defer.promise
            },
            
            /*
             * Retorna un arreglo con todas las filas de la tabla
             */
            all: function (cb) {
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
                    if(cb) cb(items)
                })  
                .catch(function (err) {
                    console.error("ERROR: ResourceFactory::all " + name)
                    if(CONFIG.debug) console.log(err)
                })
                
                return defer.promise
            },

            /*
             * Elimina un elemento de la tabla
             */
            delete: function (key, cb) {
                if(CONFIG.debug) console.log("ResourceFactory::delete " + name + "#" + key)

                var defer = $q.defer()

                localForage.removeItem(key)
                .then(function () {
                    defer.resolve()
                    if(cb) cb()
                })
                .catch(function (err) {
                    console.error("ERROR: ResourceFactory::delete " + name + "#" + key)
                    if(CONFIG.debug) console.log(err)
                })

                return defer.promise
            },

            /*
             * Borra toda la tabla
             */
            drop: function (cb) {
                if(CONFIG.debug) console.log("ResourceFactory::drop " + name)

                var defer = $q.defer()

                localForage.clear()
                .then(function () {
                    defer.resolve()
                    if(cb) cb()
                }, function (err) {
                    console.error("ERROR: ResourceFactory::drop " + name)
                    if(CONFIG.debug) console.log(err)
                    defer.reject()
                    if(cb) cb(err)
                })

                return defer.promise
            },

            /*
             * Obtiene el largo de la tabla
             */
            length: function (cb) {
                if(CONFIG.debug) console.log("ResourceFactory::length " + name)

                var defer = $q.defer()

                localForage.length()
                .then(function (length) {
                    if(CONFIG.debug) console.log(length)
                    defer.resolve(length)
                    if(cb) cb(length)
                })
                .catch(function (err) {
                    console.error("ERROR: ResourceFactory::length " + name)
                    if(CONFIG.debug) console.log(err)
                })

                return defer.promise
            },

            /*
             * Syncronizar los pendientes
             * - Considera todas las filas con .state == 'pending' y aplica save
             * - Luego de aplicar save, elimina el .state y guarda en localForage
             */
            sync: function () {
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
                        if(item.status == 'pending') // Si la fila esta en 'pending'
                        fns.push(function (callback) {
                            remote.save(item, function () {
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

                        d.resolve()
                    })

                    return d.promise
                })

                .then(function () {
                    // Pull resources
                    remote.query(function (items) {
                        items.forEach(function (item) {
                            if(CONFIG.debug) console.log(item)
                            self.set(item[CONFIG.pk], item)
                            .then(function () {
                                defer.resolve()
                            })
                        })
                    })
                })

                return defer.promise
            },

            /*
             *  
             */
            show: function() {
                this.all(function (items) {
                    if(CONFIG.debug) console.log("ResourceFactory::show " + name)
                    if(CONFIG.debug) console.log(items)
                })
            },

            /*
             * Retorna el recurso angular.resource que conecta con
             * el recurso publicado en la API
             */
            remote: function() {
                // if(this._remote != undefined)
                //     return this.remote
                this._remote = $resource(
                    CONFIG.api(pluralName.toLowerCase() + '/:id/'), 
                    { id: '@pk' }, 
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
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
}