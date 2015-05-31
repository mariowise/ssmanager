angular.module('app.controllers.login', [])

.controller('login#index', ['$scope', '$state', '$http', 'jwtHelper', 'Session', function ($scope, $state, $http, jwtHelper, Session) {
	console.log("login#index running")

	$scope.user = { username: "mariowise", password: "mario123" }

	$scope.login = function () {
		$('#loading').show()

		$http.post(CONFIG.api('auth/'), $.param($scope.user), { headers : { 'Content-Type': 'application/x-www-form-urlencoded' } })
		.success(function (res) {
			
			Session.set_current_user(res)
			.then(function (current_user) {
				console.log(current_user)
				$.loading.transition()
				$state.go("app.projects")
			})

		})
		.error(function (data, status) {
			$.loading.error("Conexión fallida.")
		})
	}
}])