angular.module('app.controllers.stateone', [])

.controller('stateone#show', ['$scope', '$stateParams', 'Project', 'StateOne', 'Media', function ($scope, $stateParams, Project, StateOne, Media) {
	console.log("stateone#show running")

	$scope.medias = []

	// Se busca el estado recién descargado
	StateOne.pull($scope.project.id)
	.then(function () {
		return StateOne.where({ ssp_stateOne: $scope.project.id })
	})
	// Se buscan las medias (que ya han sido descargadas)
	.then(function (state) {
		state = state[0]
		var medias = [].concat(state.ssp_videos,state.ssp_imagenes,state.ssp_audios,state.ssp_documentos)
		
		medias.forEach(function (media_id) {
			Media.get(media_id)
			.then(function (media) {
				$scope.medias.push(media)
			})
		})
	})

	$scope.takePhoto = function () {
		File.takePhoto()
		.then(function () {
			$.loading.show("success", 1500)
		}, function () {
			$.loading.error("No pude subir la foto")
		})
	}
}])