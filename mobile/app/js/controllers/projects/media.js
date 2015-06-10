angular.module('app.controllers.projects.media', [])

.controller('media#show', ['$scope', '$state', '$stateParams', 'Project', 'Media', 'Comment', function ($scope, $state, $stateParams, Project, Media, Comment) {
	console.log("media#show running")

	$scope.media = {}
	$scope.comments = []
	$scope.comentary = {}
	$scope.loading = true

	// Se descargan los comentarios / Sino se buscan
	Media.get($stateParams.media_id)
	.then(function (media) {
		$scope.media = media
		return Comment.pull(media.comments_media)
	})
	.then(function (comments) {
		comments = comments.sort(function (a, b) { return (-moment(a.date_comentary).unix() + moment(b.date_comentary).unix()) })
		$scope.comments = comments
		$scope.loading = false
	})

	$scope.addComment = function () {
		$.loading.show("loading")

		Media.addComment($scope.media, $scope.comentary.content_comentary)
		.then(function (newComment) {
			$scope.comments.unshift(newComment)
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
				$.loading.error("No ha sido posible eliminar")
			})
			.then(function () {
				$.loading.show("success", 1500)
				$state.go("app.project.stateone", { project_id: $scope.project.id })
			})
		}
	}
}])