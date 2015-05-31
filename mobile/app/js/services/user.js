angular.module('app.services.user', [])

.factory('User', ['$q', 'Session', 'ResourceFactory', function ($q, Session, ResourceFactory) {
	
	// Recurso local
	var User = ResourceFactory('User', 'users') // Nombre del recurso, Nombre del recurso en API (URL)

	User.current_user_profile = function (method) {
		var d = $q.defer()
		  , method = method || "find"

		Session.get("current_user")
		.then(function (current_user) {
			return User[method](current_user.id)
		})
		.then(function (profile) {
			d.resolve(profile)
		}, d.reject)

		return d.promise
	}


	// Se expone el servicio
	return User
}])