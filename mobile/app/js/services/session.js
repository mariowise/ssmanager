angular.module('app.services.session', [])

.factory('Session', ['$q', '$http', '$state', 'jwtHelper', 'Resource', 'User', function ($q, $http, $state, jwtHelper, Resource, User) {

	// Recurso local
	var Session = Resource('Session', '') // Nombre del recurso, Nombre del recurso en API (URL)
	  , response = {}

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

	Session.refresh_token = function () {
		// console.log("Session::refresh_token running")
		var d = $q.defer()

		Session.get("current_user")
		.then(function (current_user) {
			if(current_user == undefined)
				d.resolve(undefined)
			else {
				var remaining = current_user.local_exp - Date.now()/1000
				// console.log("Faltan " + remaining/(24 * 60 * 60) + " dias para renovar el token")
				if(remaining < 10 * 24 * 60 * 60) {
					$http.post(CONFIG.api("token-refresh/"), $.param({ token: current_user.token, orig_iat: current_user.orig_iat }), { headers : { 'Content-Type': 'application/x-www-form-urlencoded' } })
					.success(function (res) {
						Session.set_current_user(res)
						.then(function (cu) {
							// console.log("Session::refresh_token the token has been refreshed!")
							// console.log(cu.token)
							d.resolve(cu)
							$.notice.raise("Conectado", "success", 2000)
						})
					})
					.error(function (err) {
						console.error("Session::refresh_token failed")
						console.error(err)
						$.notice.put("Sin conexión", "danger")

						// En caso de que el error no sea por falta de conexión
						// En ese caso, cuando la respuesta trae "non_field_errors"
						// quiere decir que ha expirado el token, y es necesario volver
						// a iniciar sesión, no hay otra forma de obtener uno nuevo.
						if(err != null) {
							if(err.non_field_errors) {
								$('#loading').show()

								setTimeout(function () {
									Session.delete("current_user")
									.then(function (current_user) {
										$.loading.error("La sesión ha expirado")
										$state.go("login.index")
									})
								}, 3000)

							}
						}

						d.reject(err)
					})	
				} else d.resolve(current_user.token)
				
			}
		})		

		return d.promise
	}
	
	/*
	 *-- #### current_user()
	 *--
	 *-- * return `promise`
	 *--
	 *-- Este método entrega el current_user y en caso de no encontrarlo
	 *-- quiebra la cadena de promesas genera un error (reject) y devuelve
	 *-- al usuario al login indicandole que la sesión ha expirado
	 */
	Session.current_user = function () {
		var d = $q.defer()

		Session.get("current_user")
		.then(function (current_user) {
			User.fetch(current_user.id)
			.then(d.resolve, function (err) {
				console.error(err)
				d.resolve(current_user)
			}, d.notify)
		})
		.catch(function (err) {
			console.error(err)
			setTimeout(function () {
				Session.delete("current_user")
				.then(function () {
					$.loading.error("La sesión ha expirado")
					$state.go("login.index")
				})
			}, 3000)
			d.reject(undefined)
		})

		return d.promise
	}

	/*
	 *-- #### colabs()
	 *--
	 *-- * return `promise`
	 *-- 
	 *-- Entrega la lista de colaboradores que tiene el usuario actualmente logeado
	 *-- intenta además actualizar esta lista desde la nube, mientras tanto notifica
	 *-- el valor local, y si recibe respuesta, actualiza el local y resuelve el actualizado
	 *-- Si no logra conectarse, finalmente resuelve el valor local.
	 */
	Session.colabs = function () {
		var d = $q.defer()

		Session.get("colabs")
		.then(function (obj) {
			d.notify(obj.colabs)
			return User.colabs()
		}, function (err) {
			return User.colabs()
		})
		.then(function (rcolabs) {
			return Session.set("colabs", { colabs: rcolabs })
		}, function (err) {
			console.error(err)
			return Session.get("colabs")
		})
		.then(function (obj) {
			d.resolve(obj.colabs)
		}, d.reject)

		return d.promise
	}

	// Se expone el servicio
	return angular.extend({}, Session, response)
}])