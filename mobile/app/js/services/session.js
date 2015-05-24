angular.module('app.services.session', [])

.factory('Session', ['$q', 'jwtHelper', 'ResourceFactory', function ($q, jwtHelper, ResourceFactory) {
	
	// Recurso local
	var Session = ResourceFactory('Session', '') // Nombre del recurso, Nombre del recurso en API (URL)

	Session.set_current_user = function (res) {
		var now = Math.round(Date.now()/1000)
		  , d = $q.defer()

		if(res == undefined) {
			Session.delete("current_user")
			.then(function (current_user) {
				d.resolve(res)	
			})
		} else if(res.token != undefined) {
			payload = jwtHelper.decodeToken(res.token)

			Session.set("current_user", {
				id: payload.user_id,
				username: payload.username,
				// password: $scope.user.password, // Solo para desarrollo
				email: payload.email,
				orig_iat: payload.orig_iat,
				exp: payload.exp,
				token: res.token,
				local_iat: now,
				local_exp: now + payload.exp - payload.orig_iat - 60
			})
			.then(d.resolve)
		} else d.reject(res)

		return d.promise
	}

	// Se expone el servicio
	return Session
}])