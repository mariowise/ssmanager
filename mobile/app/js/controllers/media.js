angular.module('app.controllers.media', [])

.controller('media#show', ['$scope', '$stateParams', 'Project', 'Media', 'Comment', function ($scope, $stateParams, Project, Media, Comment) {
	console.log("media#show running")

	$scope.project = {}
	$scope.media = {}
	$scope.comments = []
	$scope.comentary = {}

	// Se busca el proyecto y luego se busca la media
	Project.get($stateParams.project_id)
	.then(function (project) {
		$scope.project = project
		return Media.get($stateParams.media_id)
	})
	// Se descargan los comentarios / Sino se buscan
	.then(function (media) {
		$scope.media = media
		return Comment.pull(media.comments_media)
	})
	.then(function (comments) {
		comments = comments.sort(function (a, b) { return moment(a.date_comentary).unix() < moment(b.date_comentary).unix() })
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
}])