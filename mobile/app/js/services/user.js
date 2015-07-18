/*--
 *-- User (Resource)
 *-- ------
 *--
*/
angular.module('app.services.user', [])

.factory('User', ['$q', 'Profile', 'Resource', function ($q, Profile, Resource) {
	
	// Recurso local
	var User = Resource('User', 'users', {
		/*--
		 *-- #### changepass(Object)
		 *--
		 *-- * param `Object`: Diccionario con los valores `old_password`, `new_password`.
		 *-- * return `promise`
		 *--
		 *-- Cambia la contraseña del usuario que se encuentra utilizando la aplicación.
		 *--
		 */
		changepass: {
			method: 'POST',
			url: CONFIG.api("users") + "/changepass/",
			responseType: 'json'
		},
		/*--
		 *-- #### colabs()
		 *--
		 *-- * return `promise`
		 *--
		 *-- Entrega una lista con todos los colaboradores de un usuario, sin importar el 
		 *-- proyecto en el cual compartan labores.
		 *--
		 */
		colabs: {
			method: 'GET',
			url: CONFIG.api("users") + "/colabs/",
			isArray: true
		}
	}) // Nombre del recurso, Nombre del recurso en API (URL)

	/*--
	 *-- #### fetchOne(key)
	 *--
	 *-- * param `key`: Object o Number 
	 *-- * return `promise`
	 *--
	 *-- Descarga un usuario, luego descarga su perfil verifica además posible errores 
	 *-- para el caso en que un usuario tenga mas de un perfil (*innecesario en la actualidad*).
	 *--
	 */
	User.fetchOne = function (key) {
		var d = $q.defer()
		  , self = this

		self.find(key)
		.then(function (user) {
			return $q.all([
				user,
				Profile.where({ user: user.id })
			])
		}, null, function (luser) {
			if(luser.profile && luser.profile.id)
				d.notify(luser)
		})
		.then(function (res) {
			var user = res[0]
			user.profile = res[1]
			if(user.profile.length == 1) {
				user.profile = user.profile[0]
				return self.set(user.id, user)
			} else {
				console.error("User::fetchOne el usuario " + user.username + " tiene " + user.profile.length + " perfiles.")
				d.reject()
			}
		})
		.then(d.resolve)
		.catch(d.reject)

		return d.promise
	}

	/*
	 *-- #### allUsers
	 *--
	 *-- * return `promise`
	 *-- 
	 *-- Busca todos los usuarios almacenados localmente y los notifica. Luego 
	 *-- intenta descargar toda la tabla de usuarios de la nube, si lo logra
	 *-- resuelve los usuarios, si falla, resuelve con los usuarios almacenados
	 *-- localmente
	*/
	User.allUsers = function () {
		var d = $q.defer()
		  , self = this

		self.all()
		.then(function (lall) {
			d.notify(lall)
			self._where({})
			.then(d.resolve, function (err) {
				console.error(err)
				d.resolve(lall)
			})
		}, d.reject)

		return d.promise
	}

	// Se expone el servicio
	return User
}])