angular.module('app.controllers.profile', [])

.controller('profile#show', ['$scope', 'Session', 'User', function ($scope, Session, User) {
	console.log("profile#show running")

	$scope.profile = {}

	// Busca el perfil actualizado desde internet y luego lo muestra
	User.current_user_profile()
	.then(function (profile) {
		$scope.profile = profile
	})

}])

.controller('profile#edit', ['$scope', '$state', 'User', function ($scope, $state, User) {
	console.log("profile#edit running")

	$scope.profile = {}

	// Se obtiene directamente desde la BD local pues se acaba de bajar en el controller anterior
	User.current_user_profile("get")
	.then(function (profile) {
		$scope.profile = profile
	})

	$scope.save = function () {
		$.loading.show("loading")
		
		User.update($scope.profile)
		.then(function (profile) {
			$.loading.show("success", 1500)
			$state.go("app.profile-show")
		})
	}

}])