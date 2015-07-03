angular.module('app.services.user', [])

.factory('User', ['$q', 'Profile', 'Resource', function ($q, Profile, Resource) {
	
	// Recurso local
	var User = Resource('User', 'users', {
		changepass: {
			method: 'POST',
			url: CONFIG.api("users") + "/changepass/",
			responseType: 'json'
		}
	}) // Nombre del recurso, Nombre del recurso en API (URL)

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