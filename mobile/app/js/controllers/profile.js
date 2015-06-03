angular.module('app.controllers.profile', [])

.controller('ProfileController', ['$scope', 'User', function ($scope, User) {
	console.log("ProfileController running")

	$scope.profile = {}

	// Busca el perfil actualizado desde internet y luego lo muestra
	User.current_user_profile()
	.then(function (profile) {
		$scope.profile = profile
	})
}])

.controller('profile#show', ['$scope', function ($scope) {
	console.log("profile#show running")

}])

.controller('profile#edit', ['$scope', '$state', 'User', function ($scope, $state, User) {
	console.log("profile#edit running")

	$scope.save = function () {
		$.loading.show("loading")
		
		User.update($scope.profile)
		.then(function (profile) {
			$.loading.show("success", 1500)
			$state.go("app.profile.show")
		})
	}
}])