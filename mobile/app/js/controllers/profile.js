angular.module('app.controllers.profile', [])

.controller('ProfileController', ['$scope', 'User', 'Session', function ($scope, User, Session) {
	console.log("ProfileController running")

	$scope.user = {}

	$scope.setUser = function (user) {
		if(angular.toJson($scope.user) != JSON.stringify(user))
			$scope.user = user
		
	}
	$scope.fetchUser = function () {
		Session.current_user()
		.then(function (current_user) {
			User.fetch($scope.current_user.id)
			.then($scope.setUser, null, $scope.setUser)
		})
	}
}])

.controller('profile#show', ['$scope', function ($scope) {
	console.log("profile#show running")
	$scope.fetchUser()
}])

.controller('profile#edit', ['$q', '$scope', '$state', 'User', 'File', function ($q, $scope, $state, User, File) {
	console.log("profile#edit running")
	$scope.fetchUser()

	$scope.save = function () {
		$.loading.show("loading")
		var profile = $scope.user.profile
		delete profile.photo_user

		$q.all([
			User._update($scope.user),
			Profile._update(profile)
		])
		.then(function (res) {
			$.loading.show("success", 1500)
			$state.go("app.profile.show")
		}, function (err) {
			console.error(err)
			$.loading.error("No ha sido posible actualizar los datos")
			$.notice.raise("Sin conexión", "danger")
		})
	}

	$scope.takePhoto = function (option) {
		$.loading.show("loading")
		var aux = (option != "select") ? File.takePhoto() : File.selectPhoto()
		aux
		.then(function (photoURI) {
			return File.upload(photoURI)
		})
		.then(function (file) {
			var profile = $scope.user.profile
			delete profile.photo_user
			profile.photo_url = JSON.parse(file.response).mediaLink
			return Profile._update(profile)
		})
		.then(function () {
			$.loading.show("success", 1500)
			$state.go("app.profile.show")
		})
		.catch(function (err) {
			$.loading.error("No ha sido posible subit la foto")
		})
	}
}])