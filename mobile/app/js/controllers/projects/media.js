angular.module('app.controllers.projects.media', [])

.controller('media#show', ['$scope', '$state', '$stateParams', 'Project', 'Media', 'Comment', function ($scope, $state, $stateParams, Project, Media, Comment) {
	console.log("media#show running")

	$scope.media = {}
	$scope.comentary = {}

	function setMedia(media) {
		$scope.media = media
	}

	Media.fetch($stateParams.media_id)
	.then(setMedia, function (err) {
		console.error(err)
	}, setMedia)

	$scope.addComment = function () {
		$.loading.show("loading")

		Media.addComment($scope.media, $scope.comentary.content_comentary)
		.then(function (newComment) {
			$scope.media.comments.unshift(newComment)
			$scope.comentary = {}
			$.loading.show("success", 1000)
		}, function (err) {
			$.loading.error("No ha sido posible subir el comentario")
		})
	}

	$scope.delete = function (key) {
		if(confirm("Estas seguro que quieres eliminar este archivo?")) {
			$.loading.show("loading")
			
			StateOne.where({ ssp_stateOne: $scope.project.id })
			.then(function (state) {
				if(state.length == 1) {
					state = state[0]
					if((i = state.ssp_videos.indexOf(key)) != -1) state.ssp_videos.splice(i, 1)
					if((i = state.ssp_imagenes.indexOf(key)) != -1) state.ssp_imagenes.splice(i, 1)
					if((i = state.ssp_audios.indexOf(key)) != -1) state.ssp_audios.splice(i, 1)
					if((i = state.ssp_documentos.indexOf(key)) != -1) state.ssp_documentos.splice(i, 1)
					return StateOne.update(state)
				}
			})
			.then(function () {
				return Media._destroy(key)
			}, function () {
				$.loading.error("No ha sido posible eliminar el contenido.")
			})
			.then(function () {
				$.loading.show("success", 1500)
				$state.go("app.project.stateone", { project_id: $scope.project.id })
			})
		}
	}
}])