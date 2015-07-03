angular.module('app.controllers.profile', [])

.controller('ProfileController', ['$scope', 'EM', function ($scope, EM) {
	console.log("ProfileController running")
	$scope.user = {}

	function setUser (user) {
		if(angular.toJson($scope.user) != JSON.stringify(user)) {
			
			EM('File').download(user.profile.photo_url || user.profile.photo_user)
			.then(function (fileUri) {
				user.profile.photo_local = fileUri
				EM('Profile').set(user.profile.id, user.profile)
				.then(function (profile) {
					$scope.user = user
				})
			})
			$scope.user = user
		}		
	}
	$scope.fetchUser = function () {
		EM('Session').current_user()
		.then(function (current_user) {
			EM('User').fetch(current_user.id)
			.then(setUser, null, setUser)
		})
	}
}])

.controller('profile#show', ['$scope', function ($scope) {
	console.log("profile#show running")
	$scope.fetchUser()
}])

.controller('profile#edit', ['$q', '$scope', '$state', 'EM', function ($q, $scope, $state, EM) {
	console.log("profile#edit running")
	$scope.fetchUser()

	$scope.save = function () {
		$.loading.show("loading")
		var profile = $scope.user.profile
		delete profile.photo_user

		$q.all([
			EM('User')._update($scope.user),
			EM('Profile')._update(profile)
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
		var aux = (option != "select") ? EM('File').takePhoto() : EM('File').selectPhoto()
		aux
		.then(function (photoURI) {
			return EM('File').upload(photoURI)
		})
		.then(function (file) {
			var profile = $scope.user.profile
			delete profile.photo_user
			profile.photo_url = JSON.parse(file.response).mediaLink
			return EM('Profile')._update(profile)
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
