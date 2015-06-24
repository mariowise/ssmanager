angular.module('app.controllers.projects.media', [])

.controller('media#show', ['$scope', '$state', '$stateParams', 'EM', function ($scope, $state, $stateParams, EM) {
	console.log("media#show running")

	$scope.media = {}
	$scope.comentary = {}

	function setMedia(media) {
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
			
			EM('StateOne').where({ ssp_stateOne: $scope.project.id })
			.then(function (state) {
				if(state.length == 1) {
					state = state[0]
					if((i = state.ssp_videos.indexOf(key)) != -1) state.ssp_videos.splice(i, 1)
					else if((i = state.ssp_imagenes.indexOf(key)) != -1) state.ssp_imagenes.splice(i, 1)
					else if((i = state.ssp_audios.indexOf(key)) != -1) state.ssp_audios.splice(i, 1)
					else if((i = state.ssp_documentos.indexOf(key)) != -1) state.ssp_documentos.splice(i, 1)
					else console.error("media#show::delete no ha sido capaz de encontrar la llave.")
					return EM('StateOne')._update(state)
				}
			})
			.then(function () {
				return EM('Media')._destroy(key)
			})
			.then(function () {
				$.loading.show("success", 1500)
				$state.go("app.project.stateone.show")
			})
			.catch(function (err) {
				$.loading.error("No ha sido posible eliminar el contenido.")
			})
		}
	}
}])