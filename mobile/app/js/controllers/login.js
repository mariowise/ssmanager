angular.module('app.controllers.login', [])

.controller('login#index', ['$scope', '$state', '$http', 'jwtHelper', 'Session', function ($scope, $state, $http, jwtHelper, Session) {
	console.log("login#index running")

	$scope.user = { username: "mariowise", password: "mario123" }

	$scope.login = function () {
		$('#loading').show()

		$http.post(CONFIG.api('auth/'), $.param($scope.user), { headers : { 'Content-Type': 'application/x-www-form-urlencoded' } })
		.success(function (res) {
			
			if(res.token != undefined) {
				payload = jwtHelper.decodeToken(res.token)

				var now = new Date().getTime()
				Session.set("current_user", {
					id: payload.user_id,
					username: $scope.user.username,
					password: $scope.user.password, // Solo para desarrollo
					email: payload.email,
					orig_iat: payload.orig_iat,
					exp: payload.exp,
					token: res.token
				})
				.then(function (current_user) {
					console.log(current_user)
					$.loading.transition()
					$state.go("app.index")
				})
			}

		})
		.error(function (data, status) {
			$.loading.error("Conexión fallida.")
		})
	}
}])