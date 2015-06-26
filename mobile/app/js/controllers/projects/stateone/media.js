angular.module('app.controllers.projects.media', [])

.controller('media#show', ['$scope', '$state', '$stateParams', 'EM', function ($scope, $state, $stateParams, EM) {
	console.log("media#show running")

	$scope.media = {}
	$scope.comentary = {}

	function setMedia(media) {
		console.info("El media de la discordia")
		console.log(media)
		if(angular.toJson($scope.media) != angular.toJson(media)) {
			$scope.media = media
		}
	}

	EM('Media').fetch($stateParams.media_id)
	.then(setMedia, null, setMedia)
	.catch(function (err) {
		console.log(err)
	})

	$scope.addComment = function () {
		$.loading.show("loading")

		EM('Media').addComment($scope.media, $scope.comentary.content_comentary)
		.then(function (media) {
			setMedia(media)
			$scope.comentary = {}
			$.loading.show("success", 1000)
		}, function (err) {
			$.loading.error("No ha sido posible subir el comentario")
		})
	}
	$scope.delete = function (key) {
		if(confirm("Estas seguro que quieres eliminar este archivo?")) {
			$.loading.show("loading")
			
			EM('StateOne').delete_media({ id: $scope.state.id, media_id: $scope.media.id })
			.then(function (state) {
				return EM('StateOne').fetch(state)
			})
			.then(function (state) {
				$scope.$emit('changeState', state)
				$.loading.show("success", 1500)
				$state.go("app.project.stateone.show")
			})
			.catch(function (err) {
				$.loading.error("No ha sido posible eliminar el contenido.")
			})
		}
	}
}])